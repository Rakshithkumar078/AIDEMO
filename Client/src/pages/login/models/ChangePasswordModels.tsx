export interface ChangePasswordFormData {
    username: string;
    oldpassword: string;
    newpassword:string;
    confirmpassword:string;
}

export interface ChangePasswordRequestObject {
    UserName: string;
    OldPassword: string;
    NewPassword:string;
    ConfirmPassword:string;
}