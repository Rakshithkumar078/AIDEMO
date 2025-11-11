import { slideUp } from './slideUp';
import { slideDown } from './slideDown';

export function slideToggle(elm:any, duration = 300) {
	if (window.getComputedStyle(elm).display === 'none') {
		slideDown(elm, duration);
	} else {
		slideUp(elm, duration);
	}
}
