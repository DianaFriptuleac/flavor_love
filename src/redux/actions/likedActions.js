export const LIKED_RICETTE = "LIKED_RICETTE";

export const likedRicette = (ricetta, userId) =>({
    type: LIKED_RICETTE,
    payload:{ricetta,userId},
});