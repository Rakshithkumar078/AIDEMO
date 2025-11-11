import * as React from "react";

export const Loader = () => {
    return (
        <div className="loader-overlay">
            <div className="loader-content">
                <i className="fas fa-circle-notch fa-spin text-theme fa-5x"></i>
            </div>
        </div>
    )
}

export const ModalLoader = () => {
    return (
        <div>
            <div className="d-flex justify-content-center align-items-center vh-75">
                <i className="fas fa-circle-notch fa-spin text-theme fa-5x"></i>
            </div>
        </div>
    )
}