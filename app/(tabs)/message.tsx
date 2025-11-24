import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { sendMessageToAI, ChatHistoryItem } from "@/api/aiChatApi";
import HeaderScreen from "@/components/HeaderScreen";
import { SafeAreaView } from "react-native-safe-area-context";
import { useScreenRefresh } from "@/hooks/useScreenRefresh";

type ChatMessage = {
  id: string;
  from: "user" | "ai";
  text: string;
  time: string;
};

const getCurrentTimeString = () => {
  const now = new Date();
  const hh = now.getHours().toString().padStart(2, "0");
  const mm = now.getMinutes().toString().padStart(2, "0");
  return `${hh}:${mm}`;
};

const createWelcomeMessage = (): ChatMessage => ({
  id: "1",
  from: "ai",
  text: "Booking Hotel xin chào. Bạn cần hỗ trợ gì về đặt phòng/khách sạn?",
  time: getCurrentTimeString(),
});

export default function MessageScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    createWelcomeMessage(),
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // hàm reload khi kéo xuống
  const onReload = async () => {
    // ở đây bạn muốn làm gì khi “load lại”:
    // ví dụ reset chat về 1 tin nhắn chào
    setMessages([createWelcomeMessage()]);
    setInput("");
    setLoading(false);
    // nếu sau này muốn load history từ server thì đặt API call ở đây
  };

  const { refreshing, handleRefresh } = useScreenRefresh(onReload);

  const handleSend = async () => {
    const content = input.trim();
    if (!content || loading) return;

    const time = getCurrentTimeString();

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      from: "user",
      text: content,
      time,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const historyForApi: ChatHistoryItem[] = [...messages, userMsg].map(
        (m) => ({
          from: m.from,
          text: m.text,
        })
      );

      const replyText = await sendMessageToAI(content, historyForApi);

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        from: "ai",
        text: replyText || "Mình đã nhận được câu hỏi của bạn.",
        time,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.log("AI error:", error);
      const errMsg: ChatMessage = {
        id: (Date.now() + 2).toString(),
        from: "ai",
        text: "Có lỗi khi kết nối server, bạn thử lại sau nhé.",
        time,
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: ChatMessage }) => {
    const isUser = item.from === "user";
    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.messageContainerUser : styles.messageContainerAI,
        ]}
      >
        <View
          style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAI]}
        >
          <Text style={[styles.text, isUser && styles.textUser]}>
            {item.text}
          </Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <SafeAreaView style={styles.container} edges={["top"]}>
        <HeaderScreen title="Tin nhắn" />

        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          refreshing={refreshing}      // dùng hook
          onRefresh={handleRefresh}    // dùng hook
        />

        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Nhập tin nhắn..."
            multiline
          />
          <TouchableOpacity
            onPress={handleSend}
            style={[styles.sendButton, loading && { opacity: 0.6 }]}
            disabled={loading}
          >
            <Text style={styles.sendText}>{loading ? "..." : "Gửi"}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F4F4F7",
  },
  container: {
    flex: 1,
    backgroundColor: "#F8FAFF",
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  messageContainer: {
    marginBottom: 10,
    flexDirection: "row",
  },
  messageContainerUser: {
    justifyContent: "flex-end",
  },
  messageContainerAI: {
    justifyContent: "flex-start",
  },
  bubble: {
    maxWidth: "80%",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  bubbleUser: {
    backgroundColor: "#DCF8C6",
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  bubbleAI: {
    backgroundColor: "#FFFFFF",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
  },
  text: {
    fontSize: 14,
    color: "#111",
  },
  textUser: {
    color: "#0B0B0B",
  },
  time: {
    marginTop: 4,
    fontSize: 10,
    color: "#888",
    alignSelf: "flex-end",
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 15,
    borderTopWidth: 0.5,
    borderTopColor: "#DDD",
    backgroundColor: "#FFFFFF",

  },
  input: {
    flex: 1,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 14,
    backgroundColor: "#FFF",
  },
  sendButton: {
    marginLeft: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  sendText: {
    color: "#FFF",
    fontWeight: "600",
  },
});
