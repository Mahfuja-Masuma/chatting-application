import { createSlice } from '@reduxjs/toolkit'

export const activeChatSlice = createSlice({
    name: "activeChat",
    initialState: {
        active: localStorage.getItem("activeFriend")?JSON.parse(localStorage.getItem("activeFriend")):null
    },


    reducers:{
        activeChat:(state,active)=> {
            state.active = active.payload
        }

    }
})

export const {activeChat} = activeChatSlice.actions

export default activeChatSlice.reducer