import { Image, Text } from "react-native";
import { s } from "./header.style";
import logoImg from "../../../assets/logo.png";

export function Header() {
  return (
    <>
      <Image style={s.img} source={logoImg} />
      <Text style={s.subtitle}>You probably have something todo</Text>
    </>
  );
}
