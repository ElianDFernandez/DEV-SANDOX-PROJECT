import { useState } from "react";
import { Container, Heading, Button, Stack, Input, Field, Text, Box, Center } from "@chakra-ui/react";
import { login } from "../api/auth";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(""); 

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg("");
        try {
            const data = await login({ email, password }); 
            if (data.access_token) {
                localStorage.setItem("token", data.access_token);
                localStorage.setItem("user_name", data.usuario.nombre);
                window.location.href = "/dashboard";
            }
        } catch (error) {
            setErrorMsg("Credenciales inválidas.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleTyping = (setter) => (e) => {
        setter(e.target.value);
        if (errorMsg) setErrorMsg("");
    };

    return (
        <Box position="relative" minH="100vh" bg="superficie.fondo">
            <Box position="absolute" inset={0} opacity={0.08} bgImage="radial-gradient(var(--chakra-colors-texto-principal) 1px, transparent 1px)"bgSize="16px 16px" pointerEvents="none" zIndex={0}/>
            <Box position="absolute" inset={0} bgGradient="radial(transparent 30%, superficie.fondo 100%)"pointerEvents="none"zIndex={0}/>
            <Center minH="100vh" position="relative" zIndex={1}>
                <Container maxW="md" p={4}>
                    <form onSubmit={handleLogin}>
                        <Stack gap={6} p={8} bg="superficie.tarjeta" borderRadius="xl" boxShadow="2xl" border="1px solid" borderColor="superficie.borde">
                            <Box h="auto" textAlign="center" mx="auto">
                                <img src="/logoV1.svg" alt="Logo" style={{ width: '100%', height: 'auto', display: 'inline-block' }} />
                            </Box>
                            <Field.Root invalid={!!errorMsg}>
                                <Field.Label fontWeight="semibold">Email</Field.Label>
                                <Input type="email" value={email} onChange={handleTyping(setEmail)} required variant="outline"/>
                            </Field.Root>
                            <Field.Root invalid={!!errorMsg}>
                                <Field.Label fontWeight="semibold">Contraseña</Field.Label>
                                <Input type="password" value={password} onChange={handleTyping(setPassword)} required variant="outline"/>
                            </Field.Root>
                            {errorMsg && ( 
                                <Text color="texto.error" fontSize="sm" textAlign="center" fontWeight="medium">
                                    {errorMsg}
                                </Text> 
                            )}
                            <Button type="submit" bg="marca.500" color="texto.inverso" loading={isLoading} size="lg" mt={2} _hover={{ bg: "marca.600" }}>
                                Entrar
                            </Button>
                        </Stack>
                    </form>
                </Container>
            </Center>
        </Box>
    );
};

export default LoginPage;