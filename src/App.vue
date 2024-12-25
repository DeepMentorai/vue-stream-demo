<template>
    <div id="app">
        <h1>Streaming Text Example</h1>
        <div id="output" ref="output"></div>
    </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';

export default {
    name: 'App',
    methods: {
        async getJWTToken() {
            const authUrl = '/api/v2/user/token'; // Proxy to API server
            const username = 'your-username';
            const password = 'your-password';

            try {
                const response = await fetch(authUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        accept: 'application/json',
                    },
                    body: new URLSearchParams({
                        grant_type: 'password',
                        username,
                        password,
                        scope: '',
                        client_id: 'string',
                        client_secret: 'string',
                    }),
                });

                if (!response.ok) {
                    throw new Error(`Failed to get JWT token: ${response.status}`);
                }

                const data = await response.json();
                return data.access_token;
            } catch (error) {
                console.error('Error fetching JWT token:', error);
                return null;
            }
        },
        async streamText() {
            const outputElement = this.$refs.output;
            outputElement.textContent = ''; // Clear previous content

            const jwtToken = await this.getJWTToken();
            if (!jwtToken) {
                outputElement.textContent = 'Failed to authenticate. Please check your credentials.';
                return;
            }

            const conversation_id = uuidv4();
            const message_id = uuidv4();
            const response_message_id = uuidv4()
            const apiUrl = `/api/v2/conversation/${conversation_id}/message/${response_message_id}`; // Proxy to API server

            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${jwtToken}`,
                    },
                    body: JSON.stringify({
                        id: message_id,
                        collection_id: 44,
                        sender: { role: 'user' },
                        content: {
                            content_type: 'text',
                            content: '肝癌中期有何症狀？',
                        },
                        children_message_id: [],
                        parent_message_id: null,
                        documents: [],
                        is_rag: true,
                    }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const reader = response.body.getReader();
                const decoder = new TextDecoder('utf-8');
                // eslint-disable-next-line no-constant-condition
                while (true) {
                  const { done, value } = await reader.read();
                  if (done) break;

                  const chunk = decoder.decode(value, { stream: true });
                  // 處理每一段流式資料
                  chunk.split("\n").forEach(line => {
                      if (line.startsWith("data:")) {
                          try {
                              const jsonData = JSON.parse(line.slice(5).trim());
                              const content = jsonData.choices[0]?.delta?.content;
                              if (content) {
                                  outputElement.textContent += content;
                                  outputElement.scrollTop = outputElement.scrollHeight; // 滾動到底部
                              }
                          } catch (error) {
                              console.error("Error parsing JSON:", error);
                          }
                      }
            });
                }
            } catch (error) {
                console.error('Error streaming text:', error);
                outputElement.textContent = 'Error occurred while streaming text.';
            }
        },
    },
    mounted() {
        this.streamText();
    },
};
</script>

<style>
#output {
    font-family: monospace;
    white-space: pre-wrap;
    border: 1px solid #ccc;
    padding: 10px;
    height: 200px;
    overflow-y: auto;
}
</style>
