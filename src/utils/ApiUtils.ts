const CHAT_SERVICE = "https://api.digitalmarke/ws";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const request = (options) => {
    const headers = new Headers();

    if (options.setContentType !== false) {
        headers.append("Content-Type", "application/json");
    }

    if (localStorage.getItem("accessToken")) {
        headers.append(
            "Authorization",
            "Bearer " + localStorage.getItem("accessToken")
        );
    }

    const defaults = { headers: headers };
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options).then((response) =>
        response.json().then((json) => {
            if (!response.ok) {
                return Promise.reject(json);
            }
            return json;
        })
    );
};


//
// export function getCurrentUser() {
//     if (!localStorage.getItem("accessToken")) {
//         return Promise.reject("No access token set.");
//     }
//
//     return request({
//         url: AUTH_SERVICE + "/users/me",
//         method: "GET",
//     });
// }

// export function getUsers() {
//     if (!localStorage.getItem("accessToken")) {
//         return Promise.reject("No access token set.");
//     }
//
//     return request({
//         url: AUTH_SERVICE + "/users/summaries",
//         method: "GET",
//     });
// }

export function countNewMessages(senderId: number, recipientId: number) {
    if (!localStorage.getItem("accessToken")) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: CHAT_SERVICE + "/messages/" + senderId + "/" + recipientId + "/count",
        method: "GET",
    });
}

export function findChatMessages(senderId: number, recipientId: number) {
    if (!localStorage.getItem("accessToken")) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: CHAT_SERVICE + "/messages/" + senderId + "/" + recipientId,
        method: "GET",
    });
}

export function findChatMessage(id: number) {
    if (!localStorage.getItem("accessToken")) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: CHAT_SERVICE + "/messages/" + id,
        method: "GET",
    });
}