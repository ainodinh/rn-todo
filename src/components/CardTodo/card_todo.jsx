import { Image, TouchableOpacity, Text } from "react-native";
import { s } from "./card_todo.style";
import checkImg from "../../../assets/check.png";

export function CardTodo({ todo, onPress, onLongPress }) {
  return (
    <TouchableOpacity
      onLongPress={() => onLongPress(todo)}
      onPress={() => onPress(todo)}
      style={s.card}
    >
      <Text
        style={[
          s.title,
          todo.isCompleted && { textDecorationLine: "line-through" },
        ]}
      >
        {todo?.title}
      </Text>
      {todo.isCompleted && <Image style={s.img} source={checkImg} />}
    </TouchableOpacity>
  );
}
