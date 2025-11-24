import os
import json
import logging
from typing import Optional

import boto3
from botocore.config import Config

from app.core.config import settings

logger = logging.getLogger(__name__)

class AmazonQService:
    """
    Simple wrapper for calling Amazon Bedrock (e.g., Amazon Q) via boto3.

    This class uses the AWS Bedrock runtime client to invoke models.
    It returns a text string response created from the model output.

    Note: The exact return format from Bedrock varies between providers. This
    code attempts to read a JSON body and extract common text fields.
    """

    def __init__(self, region: Optional[str] = None, model_id: Optional[str] = None):
        self.region = region or settings.aws_region
        self.model_id = model_id or settings.aws_bedrock_model

        # Configure boto3 client for Bedrock runtime
        config = Config(region_name=self.region)
        self.client = boto3.client("bedrock-runtime", config=config)

    def _parse_bedrock_response(self, body_bytes: bytes) -> str:
        """Extract text from the Bedrock response body bytes."""
        try:
            # Try to parse JSON
            payload = json.loads(body_bytes.decode('utf-8'))
        except Exception:
            # Not JSON - return raw text
            try:
                return body_bytes.decode('utf-8')
            except Exception:
                return ""

        # Common Bedrock response shapes vary by model. Check expected keys.
        # For example, Amazon Bedrock model responses might include 'generatedText' or 'outputText'.
        if isinstance(payload, dict):
            if 'generatedText' in payload:
                return payload['generatedText']
            if 'outputText' in payload:
                return payload['outputText']
            if 'body' in payload and isinstance(payload['body'], dict):
                # nested
                for key in ['generatedText', 'outputText', 'text']:
                    if key in payload['body']:
                        return payload['body'][key]

        # Fallback: join string values
        text_parts = [str(v) for v in payload.values() if isinstance(v, (str,))]
        return "\n".join(text_parts)

    def generate(self, prompt: str, model_id: Optional[str] = None, content_type: str = "application/json") -> str:
        """Call Bedrock runtime invoke_model with a JSON content body.

        Returns the decoded string from the model output.
        """
        model = model_id or self.model_id
        if not model:
            raise RuntimeError("No Bedrock model id configured (aws_bedrock_model)")

        try:
            # Body for text prompt may vary; Bedrock often expects {"inputText": "..."}
            payload = {"inputText": prompt}
            body = json.dumps(payload).encode('utf-8')

            response = self.client.invoke_model(
                modelId=model,
                contentType=content_type,
                accept=content_type,
                body=body
            )

            # response['body'] is a StreamingBody in boto3
            # We need to read it
            body_bytes = response['body'].read()
            result_text = self._parse_bedrock_response(body_bytes)
            return result_text
        except Exception as e:
            logger.error(f"Bedrock invoke failed: {e}")
            raise

    def stream_generate(self, prompt: str, model_id: Optional[str] = None):
        """Yield chunks from the model response. Bedrock streaming may not be supported
        in this wrapper; we just yield the full response for now.
        """
        result = self.generate(prompt, model_id=model_id)
        # For streaming, split into sentences for progressive rendering
        for chunk in result.split('\n'):
            if chunk.strip():
                yield chunk + "\n"
