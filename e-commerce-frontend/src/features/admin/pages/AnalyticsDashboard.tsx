import React from 'react';
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Box,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchAnalytics } from '../../../store/analyticsSlice';
import { format } from 'date-fns';

const AnalyticsDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { stats, loading, error } = useAppSelector((state) => state.analytics);
  const [activeTab, setActiveTab] = React.useState(0);

  React.useEffect(() => {
    dispatch(fetchAnalytics());
  }, [dispatch]);

  const renderSalesChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={stats.salesData}>
        <XAxis dataKey="date" />
        <YAxis />
        <RechartsTooltip />
        <Bar dataKey="total" fill="#2196f3" />
      </BarChart>
    </ResponsiveContainer>
  );

  const renderProductDistribution = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={stats.productDistribution}>
        <XAxis dataKey="category" />
        <YAxis />
        <RechartsTooltip />
        <Bar dataKey="revenue" fill="#4caf50" />
      </BarChart>
    </ResponsiveContainer>
  );

  const renderTopProducts = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={stats.topProducts}>
        <XAxis dataKey="product" />
        <YAxis />
        <RechartsTooltip />
        <Bar dataKey="sales" fill="#9c27b0" />
      </BarChart>
    </ResponsiveContainer>
  );

  const renderUserStats = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={stats.userGrowthData}>
        <XAxis dataKey="month" />
        <YAxis />
        <RechartsTooltip />
        <Bar dataKey="users" fill="#ff9800" />
      </BarChart>
    </ResponsiveContainer>
  );

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Analytics Dashboard
      </Typography>

      <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
        <Tab label="Overview" />
        <Tab label="Sales" />
        <Tab label="Products" />
        <Tab label="Users" />
      </Tabs>

      <Grid container spacing={3}>
        {activeTab === 0 && (
          <>
            <Grid xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Sales Overview
                  </Typography>
                  {renderSalesChart()}
                </CardContent>
              </Card>
            </Grid>
            <Grid xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Revenue by Category
                  </Typography>
                  {renderProductDistribution()}
                </CardContent>
              </Card>
            </Grid>
          </>
        )}
        {activeTab === 1 && (
          <Grid xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  User Growth
                </Typography>
                {renderUserStats()}
              </CardContent>
            </Card>
          </Grid>
        )}
        {activeTab === 2 && (
          <Grid xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Product Performance
                </Typography>
                {renderTopProducts()}
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884d8',
  '#83a6ed',
  '#8dd1e1',
  '#82ca9d',
  '#a48ad1',
] as const;

export default AnalyticsDashboard;
