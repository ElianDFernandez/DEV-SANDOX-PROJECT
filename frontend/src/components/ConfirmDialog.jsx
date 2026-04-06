import { Dialog, Button, Text } from "@chakra-ui/react";

const ConfirmDialog = ({ open, onClose, onConfirm, title = "¿Estás seguro?", message = "Esta acción no se puede deshacer.", loading = false, confirmText = "Eliminar", cancelText = "Cancelar", confirmColor = "red.600", confirmTextColor = "white" }) => {
  return (
    <Dialog.Root open={open} onOpenChange={(e) => !loading && onClose(e)}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content bg="superficie.tarjeta" borderRadius="xl" p={4} boxShadow="xl" w={{ base: "90%", md: "90%" }}>
          <Dialog.Header>
            <Dialog.Title>{title}</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <Text>{message}</Text>
          </Dialog.Body>
          <Dialog.Footer>
            <Button onClick={() => onClose()} variant="ghost" disabled={loading}>
              {cancelText}
            </Button>
            <Button bg={confirmColor} color={confirmTextColor} onClick={onConfirm} loading={loading}>
              {confirmText}
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};

export default ConfirmDialog;
