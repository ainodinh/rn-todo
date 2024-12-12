import Dialog from "react-native-dialog";
import uuid from "react-native-uuid";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Alert, ScrollView, Text, View } from "react-native";
import { s } from "./App.style";
import { Header } from "./src/components/header/header";
import { CardTodo } from "./src/components/CardTodo/card_todo";

import { useEffect, useState } from "react";
import { TabBottomMenu } from "./src/components/TabBottomMenu/TabBottomMenu";
import { ButtonAdd } from "./src/components/ButtonAdd/ButtonAdd";
import AsyncStorage from "@react-native-async-storage/async-storage";

let isFirstRendered = false;

export default function App() {
  const [todoList, setTodoList] = useState([]);

  const [selectedTab, setSelectedTab] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const filterTodoList = () => {
    switch (selectedTab) {
      case "all":
        return todoList;
      case "inProgress":
        return todoList.filter((todo) => !todo.isCompleted);
      case "done":
        return todoList.filter((todo) => todo.isCompleted);
      default:
        return todoList;
    }
  };

  const deleteTodo = (todo) => {
    Alert.alert("Delete todo", "Are you sure you want to delete this todo?", [
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          console.log("Delete this todo====", todo);
          setTodoList(todoList.filter((t) => t.id !== todo.id));
        },
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  const updateTodo = (todo) => {
    const updatedTodo = {
      ...todo,
      isCompleted: !todo.isCompleted,
    };
    const updateTodoList = [...todoList];
    const indexToUpdate = updateTodoList.findIndex((t) => t.id === todo.id);
    updateTodoList[indexToUpdate] = updatedTodo;
    setTodoList(updateTodoList);
  };

  useEffect(() => {
    if (!isFirstRendered) {
      isFirstRendered = true;
      loadTodoList();
    }
  }, []);

  useEffect(() => {
    saveTodoList();
  }, [todoList]);

  const loadTodoList = async () => {
    try {
      const todoListString = await AsyncStorage.getItem("@todoList");
      const parsedTodoList = JSON.parse(todoListString);
      setTodoList(parsedTodoList || []);
    } catch (error) {
      alert(error);
    }
  };

  const saveTodoList = async () => {
    try {
      await AsyncStorage.setItem("@todoList", JSON.stringify(todoList));
    } catch (error) {
      alert(error);
    }
  };

  const showAddTodoDialog = () => setShowAddDialog(true);

  const addTodo = () => {
    const newTodo = {
      id: uuid.v4(),
      title: inputValue,
      isCompleted: false,
    };
    console.log("new todo====", newTodo);

    setTodoList([...todoList, newTodo]);
    console.log(todoList);
    setShowAddDialog(false);
    setInputValue("");
  };

  return (
    <>
      <SafeAreaProvider>
        <SafeAreaView style={s.app}>
          <View style={s.header}>
            <Header></Header>
          </View>
          <View style={s.body}>
            <ScrollView>
              {filterTodoList().map((item) => (
                <View key={item.id} style={s.cardItem}>
                  <CardTodo
                    onLongPress={deleteTodo}
                    onPress={updateTodo}
                    todo={item}
                  ></CardTodo>
                </View>
              ))}
            </ScrollView>
          </View>
          <ButtonAdd onPress={showAddTodoDialog} />
        </SafeAreaView>
      </SafeAreaProvider>
      <View style={s.footer}>
        <TabBottomMenu
          onPress={setSelectedTab}
          todoList={todoList}
          selectedTabName={selectedTab}
        ></TabBottomMenu>
        <Dialog.Container
          visible={showAddDialog}
          onBackdropPress={() => setShowAddDialog(false)}
        >
          <Dialog.Title>Add todo</Dialog.Title>
          <Dialog.Description>Chose a name for your todo</Dialog.Description>
          <Dialog.Input
            onChangeText={setInputValue}
            placeholder="Ex: learning code"
          ></Dialog.Input>
          <Dialog.Button
            label="Cancel"
            color={"grey"}
            onPress={() => setShowAddDialog(false)}
          />
          <Dialog.Button
            disabled={inputValue?.length === 0}
            label="Save"
            onPress={addTodo}
          />
        </Dialog.Container>
      </View>
    </>
  );
}
