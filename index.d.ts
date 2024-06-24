
interface User {
    id: string;
    email: string;
    name: string | null;
    username: string;
    avatar: string | null;
    defaultTeamId: string;
    version: string;
    createdAt: number;
    billing: {
        plan: string;
        period: string | null;
        trial: string | null;
        cancelation: string | null;
        addons: any[] | null;
        email: string | null;
        tax: string | null;
        language: string | null;
        address: string | null;
        name: string | null;
        currency: string;
        status: string;
    };
    resourceConfig: {
        concurrentBuilds: number;
    };
    softBlock: string | null;
    stagingPrefix: string;
    importFlowGitProvider: string;
    importFlowGitNamespaceId: number | null;
    preferredScopesAndGitNamespaces: {
        scopeId: string;
        gitNamespaceId: number;
    }[];
    dismissedToasts: {
        name: string;
        dismissals: any[];
    }[];
    activeDashboardViews: {
        scopeId: string;
        viewPreference: string;
    }[];
    hasTrialAvailable: boolean;
    remoteCaching: {
        enabled: boolean;
    };
    dataCache: {
        excessBillingEnabled: boolean;
    };
    featureBlocks: {};
    northstarMigration: {
        teamId: string;
        projects: number;
        stores: number;
        integrationClients: number;
        integrationConfigurations: number;
        startTime: number;
        endTime: number;
    };
}

interface GithubLogin {
    createdAt: number;
    login: string;
    name: string;
    updatedAt: number;
    userId: number;
    verified: boolean;
    email: string | null;
}

interface GitRepo {
    id: number;
    slug: string;
}