// API 配置
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// ============ 类型定义 ============

export interface GreetingResponse {
  message: string;
  name: string | null;
}

export interface WeatherResponse {
  city: string;
  date: string;
  weather: string;
  temperature: number;
  humidity: number;
  wind_speed: number;
}

export interface HealthResponse {
  status: string;
}

// 自定义 API 错误类
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public statusText?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ============ 核心请求函数 ============

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { params, ...fetchOptions } = options;
  
  // 构建 URL（支持查询参数）
  const url = new URL(path, API_BASE_URL);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  // 默认配置
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    },
    ...fetchOptions,
  };

  try {
    const response = await fetch(url.toString(), config);
    
    // HTTP 错误处理
    if (!response.ok) {
      throw new ApiError(
        `HTTP error: ${response.status}`,
        response.status,
        response.statusText
      );
    }

    // 204 No Content 处理
    if (response.status === 204) {
      return undefined as T;
    }

    return await response.json();
  } catch (error) {
    // 网络错误或 fetch 失败
    if (error instanceof ApiError) {
      throw error;
    }
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ApiError(
        `Failed to connect to backend at ${API_BASE_URL}. Is it running?`
      );
    }
    throw new ApiError(error instanceof Error ? error.message : 'Unknown error');
  }
}

// ============ HTTP 方法封装 ============

const api = {
  get: <T>(path: string, options?: RequestOptions) => 
    request<T>(path, { ...options, method: 'GET' }),
  
  post: <T>(path: string, body: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'POST', body: JSON.stringify(body) }),
  
  put: <T>(path: string, body: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'DELETE' }),
};

// ============ 业务 API ============

export const greetingApi = {
  /**
   * 获取个性化问候语
   * @param name - 用户名
   */
  getGreeting: (name: string): Promise<GreetingResponse> =>
    api.get<GreetingResponse>(`/greet/${encodeURIComponent(name)}`),
};

export const weatherApi = {
  /**
   * 获取今日天气
   */
  getWeather: (): Promise<WeatherResponse> =>
    api.get<WeatherResponse>('/weather'),
};

export const healthApi = {
  /**
   * 健康检查
   */
  checkHealth: (): Promise<HealthResponse> =>
    api.get<HealthResponse>('/health'),
};

// ============ 组合导出 ============

export { API_BASE_URL };

// 默认导出所有 API
export default {
  greeting: greetingApi,
  weather: weatherApi,
  health: healthApi,
};
