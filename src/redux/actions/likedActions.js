export const LIKED_RICETTE = "LIKED_RICETTE";

export const likedRicette = (ricetta) =>({
    type: LIKED_RICETTE,
    payload: ricetta,
});