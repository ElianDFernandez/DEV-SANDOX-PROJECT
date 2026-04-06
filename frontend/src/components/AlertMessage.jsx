import { Text } from "@chakra-ui/react";

const AlertMessage = ({ type = "error", children, ...props }) => {
  const color = type === "error" ? "texto.error" : type === "success" ? "texto.success" : "texto.principal";
  return (
    <Text color={color} bg="superficie.fondo" mb={6} fontWeight="bold" p={3} borderRadius="md" {...props}>
      {children}
    </Text>
  );
};

export default AlertMessage;
