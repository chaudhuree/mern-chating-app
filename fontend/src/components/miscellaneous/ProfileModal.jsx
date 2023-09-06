import { ViewIcon } from "@chakra-ui/icons";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    IconButton,
    Text,
    Image,
} from "@chakra-ui/react";

const ProfileModal = ({ user, children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            {/*this is a reusable component.so when the children are given as for SideDrawer menuitem is given then it will show it. but if this is not given it will show the eye icon,but it will work normally as usual.*/}

            {children ? (
                <span onClick={onOpen}>{children}</span>
            ) : (
                 <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen}  aria-label="eye"/>
             )}
            <Modal size="sm" onClose={onClose} isOpen={isOpen} isCentered>
                <ModalOverlay />
                <ModalContent h="410px">
                    <ModalHeader
                        fontSize="20px"
                        fontFamily="Source Code Pro"
                        display="flex"
                        justifyContent="center"
                    >
                        {user.name}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display="flex"
                        flexDir="column"
                        alignItems="center"
                        justifyContent="center"
                        gap="40px"
                    >
                        <Image
                            borderRadius="full"
                            boxSize="120px"
                            src={user.pic}
                            alt={user.name}
                        />
                        <Text
                            fontSize={{ base: "20px", md: "16px" }}
                            fontFamily="Source Code Pro"
                        >
                            Email: {user.email}
                        </Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default ProfileModal;
