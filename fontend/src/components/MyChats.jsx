import {AddIcon} from "@chakra-ui/icons";
import {Box, Stack, Text} from "@chakra-ui/react";
import {useToast} from "@chakra-ui/react";
import axios from "axios";
import {useEffect, useState} from "react";
import {getSender} from "../config/ChatLogics.js";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import {Button} from "@chakra-ui/react";
import {ChatState} from "../Context/ChatProvider";

const MyChats = ({fetchAgain}) => {
    const [loggedUser, setLoggedUser] = useState();

    const {selectedChat, setSelectedChat, user, chats, setChats,notification} = ChatState();

    const toast = useToast();

    const fetchChats = async () => {
        // console.log(user._id);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const {data} = await axios.get("/api/v1/fetchchats", config);
            setChats(data);
        }
        catch (error) {
            toast({
                      title      : "Error Occured!",
                      description: "Failed to Load the chats",
                      status     : "error",
                      duration   : 5000,
                      isClosable : true,
                      position   : "bottom-left",
                  });
        }
    };

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
        fetchChats();
        // eslint-disable-next-line
    }, [fetchAgain]);

    return (
        // this display part is for the mobile view. when the chat is selected the chat will be shown and the chat list
        // will be hidden. that means in mobile screen it is not nice to show the chat list pannel and the chat context
        // pannel at the same time. so, we are hiding the chat list pannel when the chat is selected.
        <Box
            display={{base: selectedChat ? "none" : "flex", md: "flex"}}
            flexDir="column"
            alignItems="center"
            p={3}
            bg="white"
            w={{base: "100%", md: "31%"}}
            borderRadius="lg"
            borderWidth="1px"
        >
            <Box
                pb={3}
                px={3}
                fontSize={{base: "20px", md: "24px"}}
                fontFamily="Source Code Pro"
                display="flex"
                w="100%"
                justifyContent="space-between"
                alignItems="center"


            >
                <Text color="#ff4e00 ">Chats</Text>

                <GroupChatModal>
                    <Button
                        display="flex"
                        fontSize={{base: "17px", md: "10px", lg: "17px"}}
                        rightIcon={<AddIcon/>}
                        fontWeight="normal"
                    >
                        New Group Chat
                    </Button>
                </GroupChatModal>
            </Box>
            <Box
                display="flex"
                flexDir="column"
                p={3}
                bg="#F8F8F8"
                w="100%"
                h="100%"
                borderRadius="lg"
                overflowY="hidden"
            >
                {chats ? (
                    <Stack overflowY="scroll">
                        {chats.map((chat) => (
                            
                            
                            <Box
                                onClick={() => setSelectedChat(chat)}
                                cursor="pointer"
                                bg={selectedChat === chat ? "#ff4e00" : "#E8E8E8"}
                                fontWeight={selectedChat === chat ? "bold" : "normal"}
                                color={selectedChat === chat ? "white" : "black"}
                                px={3}
                                py={2}
                                borderRadius="lg"
                                key={chat._id}
                            >
                                <Text>
                                    {!chat.isGroupChat
                                     ? getSender(loggedUser, chat.users)
                                     : chat.chatName}
                                </Text>
                                {chat.latestMessage && (
                                    <Text fontSize="xs">
                                        <b>{chat.latestMessage.sender.name} : </b>
                                        {chat.latestMessage.content.length > 50
                                         ? chat.latestMessage.content.substring(0, 51) + "..."
                                         : chat.latestMessage.content}
                                    </Text>
                                )}
                            </Box>
                        ))}
                    </Stack>
                ) : (
                     <ChatLoading/>
                 )}
            </Box>
        </Box>
    );
};

export default MyChats;
