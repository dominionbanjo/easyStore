import { apiManager } from "./apiManager";

export interface IParticipant {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  avatar: string | null;
  account_type: string;
  store_name?: string | null;
  store_slug?: string | null;
  created_at?: string;
}

export interface IMessage {
  id: string;
  sender_id: string;
  recipient_id: string | null;
  conversation_id: string | null;
  is_public: boolean;
  content: string;
  product_id: string | null;
  product_name: string | null;
  product_image: string | null;
  product_slug: string | null;
  delivered_at: string | null;
  read_at: string | null;
  created_at: string;
  updated_at: string;
  sender: IParticipant;
  read_count?: number;
  status?: "sending" | "sent" | "failed";
  localId?: string;
}

export interface IConversation {
  id: string;
  other_participant: IParticipant;
  last_message_preview: string | null;
  last_message_at: string | null;
  unread_count: number;
  created_at: string;
}

export interface PaginatedResponse<T> {
  data: {
    items: T[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
  message: string;
}

export const messagingApi = apiManager.injectEndpoints({
  endpoints: (builder) => ({
    getChatroomMessages: builder.query<PaginatedResponse<IMessage>, { page?: number; limit?: number }>({
      query: (params) => ({
        url: "messaging/chatroom",
        method: "GET",
        params,
      }),
      providesTags: ["Messaging"],
      keepUnusedDataFor: 8640000,
    }),
    sendChatroomMessage: builder.mutation<any, { content: string; product_id?: string; product_name?: string; product_image?: string; product_slug?: string; local_id?: string }>({
      query: (body) => ({
        url: "messaging/chatroom",
        method: "POST",
        body,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled, getState }) {
        const state = getState() as any;
        const user = state.user.currentUser;
        const tempId = args.local_id || `temp-${Date.now()}`;

        const optimisticMessage: IMessage = {
          id: tempId,
          localId: tempId,
          sender_id: user?.id,
          recipient_id: null,
          conversation_id: null,
          is_public: true,
          content: args.content,
          product_id: args.product_id || null,
          product_name: args.product_name || null,
          product_image: args.product_image || null,
          product_slug: args.product_slug || null,
          delivered_at: null,
          read_at: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          sender: {
            id: user?.id,
            first_name: user?.first_name || "Me",
            last_name: user?.last_name || "",
            avatar: user?.avatar || null,
            username: user?.username || "me",
            account_type: user?.account_type || "user",
          } as any,
          status: "sending",
        };

        const patchResult = dispatch(
          messagingApi.util.updateQueryData("getChatroomMessages", {}, (draft) => {
            if (draft?.data?.items) {
              draft.data.items.push(optimisticMessage);
            }
          })
        );

        try {
          const { data: result } = await queryFulfilled;
          const realMessage = result.data;

          dispatch(
            messagingApi.util.updateQueryData("getChatroomMessages", {}, (draft) => {
              if (draft?.data?.items) {
                const index = draft.data.items.findIndex(m => 
                  m.id === tempId || (args.local_id && m.localId === args.local_id)
                );
                if (index !== -1) {
                  draft.data.items[index] = { ...realMessage, status: "sent", localId: args.local_id };
                } else {
                  const exists = draft.data.items.find(m => m.id === realMessage.id);
                  if (!exists) draft.data.items.push({ ...realMessage, status: "sent" });
                }
              }
            })
          );
        } catch {
          patchResult.undo();
          // Re-insert as failed
          dispatch(
            messagingApi.util.updateQueryData("getChatroomMessages", {}, (draft) => {
              if (draft?.data?.items) {
                const exists = draft.data.items.find(m => m.id === tempId);
                if (!exists) {
                   draft.data.items.push({ ...optimisticMessage, status: "failed" });
                }
              }
            })
          );
        }
      },
    }),
    getUserConversations: builder.query<{ data: IConversation[] }, void>({
      query: () => "messaging/conversations",
      providesTags: ["Messaging"],
      keepUnusedDataFor: 8640000,
    }),
    startConversation: builder.mutation<{ data: IConversation }, { recipient_id: string }>({
      query: (body) => ({
        url: "messaging/conversations",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Messaging"],
    }),
    getConversationMessages: builder.query<PaginatedResponse<IMessage>, { id: string; page?: number; limit?: number }>({
      query: ({ id, ...params }) => ({
        url: `messaging/conversations/${id}/messages`,
        method: "GET",
        params,
      }),
      providesTags: (_result, _error, { id }) => [{ type: "Messaging", id }],
      keepUnusedDataFor: 8640000,
    }),
    sendDirectMessage: builder.mutation<any, { id: string; content: string; product_id?: string; product_name?: string; product_image?: string; product_slug?: string; local_id?: string }>({
      query: ({ id, ...body }) => ({
        url: `messaging/conversations/${id}/messages`,
        method: "POST",
        body,
      }),
      async onQueryStarted({ id, ...args }, { dispatch, queryFulfilled, getState }) {
        const state = getState() as any;
        const user = state.user.currentUser;
        const tempId = args.local_id || `temp-${Date.now()}`;

        const optimisticMessage: IMessage = {
          id: tempId,
          localId: tempId,
          sender_id: user?.id,
          recipient_id: null,
          conversation_id: id,
          is_public: false,
          content: args.content,
          product_id: args.product_id || null,
          product_name: args.product_name || null,
          product_image: args.product_image || null,
          product_slug: args.product_slug || null,
          delivered_at: null,
          read_at: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          sender: {
            id: user?.id,
            first_name: user?.first_name || "Me",
            last_name: user?.last_name || "",
            avatar: user?.avatar || null,
            username: user?.username || "me",
            account_type: user?.account_type || "user",
          } as any,
          status: "sending",
        };

        const patchResult = dispatch(
          messagingApi.util.updateQueryData("getConversationMessages", { id }, (draft) => {
            if (draft?.data?.items) {
              // Check if it already exists (maybe from socket)
              const exists = draft.data.items.find(m => m.id === tempId || (args.local_id && m.localId === args.local_id));
              if (!exists) {
                draft.data.items.push(optimisticMessage);
              }
            }
          })
        );

        // Also update conversations list for last message preview
        const listPatch = dispatch(
          messagingApi.util.updateQueryData("getUserConversations", undefined, (draft) => {
            const conv = draft?.data?.find(c => c.id === id);
            if (conv) {
              conv.last_message_preview = args.content;
              conv.last_message_at = optimisticMessage.created_at;
            }
          })
        );

        try {
          const { data: result } = await queryFulfilled;
          const realMessage = result.data;

          dispatch(
            messagingApi.util.updateQueryData("getConversationMessages", { id }, (draft) => {
              if (draft?.data?.items) {
                const index = draft.data.items.findIndex(m => 
                  m.id === tempId || (args.local_id && m.localId === args.local_id)
                );
                if (index !== -1) {
                  draft.data.items[index] = { ...realMessage, status: "sent", localId: args.local_id };
                } else {
                  const exists = draft.data.items.find(m => m.id === realMessage.id);
                  if (!exists) draft.data.items.push({ ...realMessage, status: "sent" });
                }
              }
            })
          );
        } catch {
          patchResult.undo();
          listPatch.undo();
          dispatch(messagingApi.util.invalidateTags(["Messaging"]));
          
          dispatch(
            messagingApi.util.updateQueryData("getConversationMessages", { id }, (draft) => {
              if (draft?.data?.items) {
                // Remove the optimistic one and add the failed one (or just update status if still there)
                const index = draft.data.items.findIndex(m => m.id === tempId);
                if (index !== -1) {
                  draft.data.items[index] = { ...optimisticMessage, status: "failed" };
                } else {
                  draft.data.items.push({ ...optimisticMessage, status: "failed" });
                }
              }
            })
          );
        }
      },
    }),
    markConversationRead: builder.mutation<void, string>({
      query: (id) => ({
        url: `messaging/conversations/${id}/read`,
        method: "PATCH",
      }),
      // Only update the unread badge on the conversation list.
      // Do NOT invalidate { type: "Messaging", id } (the messages query) —
      // that would re-fetch all messages every time you open a chat.
      // Instead, optimistically zero-out the unread_count directly without refetching.
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          messagingApi.util.updateQueryData("getUserConversations", undefined, (draft) => {
            const conv = draft?.data?.find((c) => c.id === id);
            if (conv) {
              conv.unread_count = 0;
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),
    getMessageById: builder.query<{ data: IMessage }, string>({
      query: (id) => `messaging/messages/${id}`,
    }),
    getUserPresence: builder.query<{ data: { online: boolean; last_seen: string | null } }, string>({
      query: (userId) => `messaging/presence/${userId}`,
    }),
  }),
});

export const {
  useGetChatroomMessagesQuery,
  useSendChatroomMessageMutation,
  useGetUserConversationsQuery,
  useStartConversationMutation,
  useGetConversationMessagesQuery,
  useSendDirectMessageMutation,
  useMarkConversationReadMutation,
  useGetMessageByIdQuery,
  useGetUserPresenceQuery,
} = messagingApi;
