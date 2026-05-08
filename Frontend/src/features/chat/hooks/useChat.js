import { initializeSocketConnection } from "../service/chat.socket";
import { sendMessage, getChats, getMessages, deleteChat } from "../service/chat.api";
import { setChats, setCurrentChatId, setError, setLoading, createNewChat, addNewMessage, addMessages } from "../chat.slice";
import { useDispatch } from "react-redux";


export const useChat = () => {

    const dispatch = useDispatch()


    async function handleSendMessage({ message, chatId }) {
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))
            const data = await sendMessage({ message, chatId })
            const { chat, aiMessage } = data
            if (!chatId)
                dispatch(createNewChat({
                    chatId: chat._id,
                    title: chat.title,
                }))
            dispatch(addNewMessage({
                chatId: chatId || chat._id,
                content: message,
                role: "user",
            }))
            dispatch(addNewMessage({
                chatId: chatId || chat._id,
                content: aiMessage.content,
                role: aiMessage.role,
            }))
            dispatch(setCurrentChatId(chat._id))
            return data
        } catch (err) {
            dispatch(setError(err.response?.data?.message || "Failed to send message"))
            return null
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleGetChats() {
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))
            const data = await getChats()
            const { chats } = data
            dispatch(setChats(chats.reduce((acc, chat) => {
                acc[ chat._id ] = {
                    id: chat._id,
                    title: chat.title,
                    messages: [],
                    lastUpdated: chat.updatedAt,
                }
                return acc
            }, {})))
            return data
        } catch (err) {
            dispatch(setError(err.response?.data?.message || "Failed to load chats"))
            return null
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleOpenChat(chatId, chats) {
        try {
            dispatch(setError(null))

            if (chats[ chatId ]?.messages.length === 0) {
                const data = await getMessages(chatId)
                const { messages } = data

                const formattedMessages = messages.map(msg => ({
                    content: msg.content,
                    role: msg.role,
                }))

                dispatch(addMessages({
                    chatId,
                    messages: formattedMessages,
                }))
            }
            dispatch(setCurrentChatId(chatId))
        } catch (err) {
            dispatch(setError(err.response?.data?.message || "Failed to open chat"))
        }
    }

    async function handleDeleteChat(chatId, chats, currentChatId) {
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))
            const data = await deleteChat(chatId)
            const updatedChats = { ...chats }
            delete updatedChats[ chatId ]
            dispatch(setChats(updatedChats))
            if (currentChatId === chatId) {
                dispatch(setCurrentChatId(null))
            }
            return data
        } catch (err) {
            dispatch(setError(err.response?.data?.message || "Failed to delete chat"))
            return null
        } finally {
            dispatch(setLoading(false))
        }
    }

    return {
        initializeSocketConnection,
        handleSendMessage,
        handleGetChats,
        handleOpenChat,
        handleDeleteChat,
    }

}
