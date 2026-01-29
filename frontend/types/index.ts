// Types pour l'authentification
export interface User {
    id: string;
    email: string;
    username: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
    createdAt: string;
    updatedAt: string;
}

export interface AuthTokens {
    access: string;
    refresh: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    username: string;
    password: string;
    firstName?: string;
    lastName?: string;
}

// Types pour les cryptomonnaies
export interface Cryptocurrency {
    id: string;
    symbol: string;
    name: string;
    price: number;
    change24h: number;
    volume24h: number;
    marketCap: number;
    image?: string;
}

export interface CryptoPrice {
    symbol: string;
    price: number;
    timestamp: number;
    change: number;
    high24h: number;
    low24h: number;
}

// Types pour le portfolio
export interface PortfolioAsset {
    id: string;
    cryptocurrency: Cryptocurrency;
    amount: number;
    averageBuyPrice: number;
    currentValue: number;
    profitLoss: number;
    profitLossPercentage: number;
}

export interface Portfolio {
    id: string;
    userId: string;
    totalValue: number;
    totalInvested: number;
    totalProfitLoss: number;
    totalProfitLossPercentage: number;
    assets: PortfolioAsset[];
    updatedAt: string;
}

// Types pour le trading
export type OrderType = 'market' | 'limit' | 'stop-loss' | 'stop-limit';
export type OrderSide = 'buy' | 'sell';
export type OrderStatus = 'pending' | 'filled' | 'cancelled' | 'rejected';

export interface Order {
    id: string;
    userId: string;
    symbol: string;
    type: OrderType;
    side: OrderSide;
    amount: number;
    price?: number;
    stopPrice?: number;
    status: OrderStatus;
    filledAmount: number;
    createdAt: string;
    updatedAt: string;
}

export interface Trade {
    id: string;
    orderId: string;
    symbol: string;
    side: OrderSide;
    amount: number;
    price: number;
    fee: number;
    total: number;
    timestamp: string;
}

// Types pour les graphiques
export interface CandlestickData {
    timestamp: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

export interface ChartData {
    symbol: string;
    interval: '1m' | '5m' | '15m' | '1h' | '4h' | '1d' | '1w';
    data: CandlestickData[];
}

// Types pour les notifications
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
}

// Types pour les réponses API
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    pagination: {
        page: number;
        pageSize: number;
        totalPages: number;
        totalItems: number;
    };
}
