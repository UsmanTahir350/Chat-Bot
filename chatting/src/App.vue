 <template>
  <div class="chatbot">
    <h1>Chat-Bot</h1>

    <div class="chat-box">
      <div v-for="(msg, index) in chatHistory" :key="index" class="chat-line">
        <p><strong>You:</strong> {{ msg.question }}</p>
        <p><strong>AI:</strong> {{ msg.answer }}</p>
        <hr />
      </div>
    </div>

    <div class="input-area">
      <input
        v-model="chatting"
        placeholder="Type message..."
        @keyup.enter="sendMessage"
      />
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import OpenAI from "openai";
import AITools, { toolsList } from "./schoolTools.js";

const chatting = ref("");
const response = ref("");
const chatHistory = ref([]);

const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

async function sendMessage() {
  if (!chatting.value.trim()) return;

  const msg = chatting.value;
  chatting.value = "";
  response.value = "Thinking...";

  try {
    const result = await client.chat.completions.create({
      model: "gpt-4o-mini",
        messages: [
          { role: "system", content:`Tumhara kaam hai user ke message se yeh decide karna ke kis function kaam karega.
Yeh available tools hain:
${toolDescriptions}

Return sirf us function ka exact name likho (e.g. "getStudentInformationByName")
Agar koi match nahi milta toh likho "none".`
          },
          { role: "user", content: msg }
        ],
        tools: toolsList.map(tool => ({
          type: "function",
          function: {
            name: tool.name,
            description: tool.description
          }
        })),
    });

    const choice = result.choices[0];
    let finalAnswer = "";

    if (choice.message.tool_calls && choice.message.tool_calls.length > 0) {
  const call = choice.message.tool_calls[0];
  const funcName = call.function.name;
  const toolCallId = call.id; // 👈 ye zaroor hona chahiye

  let args = {};
  try {
    args = call.function.arguments ? JSON.parse(call.function.arguments) : {};
  } catch (e) {
    console.error("Invalid JSON arguments:", e);
    args = {};
  }

  const toolFunc = AITools[funcName];
  let toolResult;

  if (typeof toolFunc === "function") {
    try {
      // Arguments object se values nikal kar pass kar rahe hain
      toolResult = toolFunc(...Object.values(args));
    } catch (e) {
      console.error(`Error running ${funcName}:`, e);
      toolResult = { error: `Error running ${funcName}: ${e.message}` };
    }
  } else {
    console.error(`Function ${funcName} not found in AITools`);
    toolResult = { error: `Function ${funcName} not found in AITools.` };
  }

  // ✅ Important fix: ensure tool_call_id exists and is string
  if (!toolCallId || typeof toolCallId !== "string") {
    console.error("Missing or invalid tool_call_id:", toolCallId);
    throw new Error("tool_call_id missing or invalid");
  }

  // ✅ Now send result back to AI
  const final = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are an assistant that explains school tool results in a clear way." },
      { role: "user", content: msg },
      choice.message,
      {
        role: "tool",
        tool_call_id: toolCallId, // 👈 must exactly match call.id
        content: JSON.stringify(toolResult), // 👈 must be string
      },
    ],
  });

  finalAnswer = final.choices?.[0]?.message?.content || "No response from AI.";
} else {
  finalAnswer = choice.message.content || "AI did not respond.";
}

    response.value = finalAnswer;
  } catch (err) {
    console.error("Chat Error:", err);
    response.value = "Error: " + err.message;
  }

  chatHistory.value.push({ question: msg, answer: response.value });
}
</script>


<style>
.chatbot {
  width: 420px;
  margin: 30px auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 0 10px #ccc;
}
.chat-box {
  background: white;
  padding: 10px;
  border-radius: 10px;
  height: 300px;
  overflow-y: auto;
  margin-bottom: 10px;
}
.chat-line {
  margin-bottom: 8px;
}
.input-area {
  display: flex;
  gap: 10px;
}
input {
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
}
button {
  padding: 10px 15px;
  border: none;
  background: #3498db;
  color: white;
  border-radius: 8px;
  cursor: pointer;
}
button:hover {
  background: #2980b9;
}
</style>
