import Swal from "sweetalert2";

const sweetAlertMixin = Swal.mixin({
    customClass: {
        confirmButton: "btn btn-danger px-5",
        cancelButton: "btn btn-outline-theme px-5 mx-2",
    },
    buttonsStyling: false,
});

const SweetAlertService = {
    success: (title: string, message: string) => {
        return sweetAlertMixin
            .fire({
                title: title,
                text: message,
                icon: undefined,
                imageUrl: "/assets/img/images/Success_SweetAlert.svg",
                imageWidth: 100,
                imageHeight: 100,
                imageAlt: "Success custom icon",
                showConfirmButton: true,
                timer: 3500,
                customClass: {
                    confirmButton: "btn btn-outline-theme px-5",
                },
            })
            .then((result: any) => {
                if (result.isConfirmed) {
                    sweetAlertMixin.close();
                }
            });
    },
    error: (title: string, message: string) => {
        return sweetAlertMixin.fire({
            title: title,
            text: message,
            icon: "error",
            confirmButtonText: "OK",
            customClass: {
                confirmButton: "btn btn-danger px-5",
            },
        });
    },
    errorWithHTML: (title: string, message: string) => {
        return sweetAlertMixin.fire({
            title: title,
            html: message,
            icon: "error",
            confirmButtonText: "OK",
            customClass: {
                confirmButton: "btn btn-danger px-5",
            },
        });
    },
    confirm: (title: string, message: string) => {
        return sweetAlertMixin.fire({
            title: title,
            text: message,
            icon: undefined,
            imageUrl: "/assets/img/images/Error_SweetAlert.svg",
            imageWidth: 100,
            imageHeight: 100,
            imageAlt: "Custom confetti icon",
            showCancelButton: true,
            confirmButtonText: "Yes, Delete",
            cancelButtonText: "No, Cancel",
            reverseButtons: true,
            customClass: {
                cancelButton: "btn btn-outline-theme px-5 mx-2",
                confirmButton: "btn btn-danger px-5"
            }
        });
    },
    confirmApprove: (
        title: string,
        message: string,
        approveButtonText: string,
        cancelButtonText: string
    ) => {
        return sweetAlertMixin.fire({
            title: title,
            text: message,
            icon: "success",
            showCancelButton: true,
            confirmButtonText: approveButtonText,
            cancelButtonText: cancelButtonText,
            reverseButtons: true,
            customClass: {
                cancelButton: "btn btn-outline-theme px-5 mx-2",
                confirmButton: "btn btn-success px-5"
            }
        });
    },
    confirmReject: (
        title: string,
        message: string,
        rejectButtonText: string,
        cancelButtonText: string
    ) => {
        return sweetAlertMixin.fire({
            title: title,
            text: message,
            icon: "error",
            showCancelButton: true,
            confirmButtonText: rejectButtonText,
            cancelButtonText: cancelButtonText,
            reverseButtons: true,
            customClass: {
                cancelButton: "btn btn-outline-theme px-5 mx-2",
                confirmButton: "btn btn-danger px-5"
            }
        });
    },
    info: (title: string, message: string) => {
        return sweetAlertMixin.fire({
            title: title,
            text: message,
            icon: "info",
            confirmButtonText: "OK",
            reverseButtons: true,
            allowOutsideClick: false,
            customClass: {
                confirmButton: "btn btn-theme px-5",
            },
        });
    },
    warning: (title: string, message: string) => {
        return sweetAlertMixin.fire({
            title: title,
            text: message,
            icon: "warning",
            imageWidth: 100,
            imageHeight: 100,
            imageAlt: "Custom confetti icon",
            showCancelButton: true,
            confirmButtonText: "Yes, Leave",
            cancelButtonText: "No, Cancel",
            reverseButtons: true,
            customClass: {
                cancelButton: "btn btn-outline-theme px-5 mx-2",
                confirmButton: "btn btn-danger px-5"
            }
        });
    },
};

export default SweetAlertService;