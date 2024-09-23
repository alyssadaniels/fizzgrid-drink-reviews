import React from "react";

export const ModalContext = React.createContext({
    setShowLoginModal: (state: boolean) => {
        console.log(state);
    },
    setShowProfileModal: (state: boolean) => {
        console.log(state);
    },
    setShowAddDrinkModal: (state: boolean) => {
        console.log(state);
    },
    setShowIssueModal: (state: boolean) => {
        console.log(state);
    },
});
