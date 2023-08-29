import React from 'react';
import {Box, Container,Text, Tabs, TabList, TabPanels, Tab, TabPanel} from "@chakra-ui/react";
import Login from "../components/authentication/Login.jsx";
import Register from "../components/authentication/Register.jsx";

const HomePage = () => {
    return (
        <Container maxW="xl" centerContent mb={10}>
        <Box
            d="flex"
            justifyContent="center"
            p={3}
            bg="white"
            w="100%"
            m="40px 0 15px 0"
            borderWidth="1px">

            <Text align="center" fontSize="2xl" fontFamily="Source Code Pro" fontWeight="extrabold" textTransform="uppercase">Envelop</Text>
        </Box>
        <Box width='100%' bg="white" borderWidth="1px">
            <Tabs>
                <TabList mb='1em'>
                    <Tab width='50%' fontWeight="bold">Login</Tab>
                    <Tab width='50%' fontWeight="bold">Register</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        <Login></Login>
                    </TabPanel>
                    <TabPanel>
                        <Register></Register>
                    </TabPanel>

                </TabPanels>
            </Tabs>
        </Box>
        </Container>
    );
};

export default HomePage;