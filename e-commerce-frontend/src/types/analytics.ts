export interface SalesData {
  date: string;
  total: number;
}

export interface ProductDistribution {
  name: string;
  value: number;
}

export interface TopProduct {
  id: string;
  name: string;
  category: string;
  image: string;
  sales: number;
  revenue: number;
}

export interface UserGrowthData {
  month: string;
  users: number;
}

export interface AnalyticsStats {
  salesData: SalesData[];
  productDistribution: ProductDistribution[];
  topProducts: TopProduct[];
  userGrowthData: UserGrowthData[];
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
}

export interface AnalyticsState {
  stats: AnalyticsStats;
  loading: boolean;
  error: string | null;
}
