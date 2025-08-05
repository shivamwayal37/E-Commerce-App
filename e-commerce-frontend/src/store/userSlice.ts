import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User, UserPreferences, UserSecuritySettings } from '../types/user';
import { userService } from '../services/userService';

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async () => {
    return await userService.fetchUsers();
  }
);

export const fetchUser = createAsyncThunk<User, string>(
  'users/fetchUser',
  async (userId: string) => {
    const users = await userService.fetchUsers();
    const user = users.find(user => user.id === userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    return user;
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ userId, user }: { userId: string; user: Partial<User> }) => {
    return await userService.updateUser(userId, user);
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId: string) => {
    await userService.deleteUser(userId);
    return userId;
  }
);

export const updateProfile = createAsyncThunk(
  'users/updateProfile',
  async (args: { userId: string; profileData: Partial<User> }) => {
    return await userService.updateUser(args.userId, args.profileData);
  }
);

export const updatePreferences = createAsyncThunk(
  'users/updatePreferences',
  async (args: { userId: string; preferences: UserPreferences }) => {
    await userService.updatePreferences(args.userId, args.preferences);
    return args.preferences;
  }
);

export const updateSecuritySettings = createAsyncThunk(
  'users/updateSecuritySettings',
  async (args: { userId: string; security: UserSecuritySettings }) => {
    await userService.updateSecuritySettings(args.userId, args.security);
    return args.security;
  }
);

const initialState = {
  users: [] as User[],
  selectedUser: null as User | null,
  loading: false,
  error: null as string | null,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setError: (state, action) => {
      state.error = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.selectedUser = action.payload;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex((user) => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user.id !== action.payload);
      });
  },
});

export const { setError, setLoading } = userSlice.actions;
export default userSlice.reducer;
