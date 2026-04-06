import { Center, Spinner } from "@chakra-ui/react";
import MainLayout from "./MainLayout";

const PageLoader = ({ color = "marca.500", size = "xl", thickness = "4px" }) => (
  <MainLayout>
    <Center h="70vh">
      <Spinner size={size} color={color} thickness={thickness} />
    </Center>
  </MainLayout>
);

export default PageLoader;
