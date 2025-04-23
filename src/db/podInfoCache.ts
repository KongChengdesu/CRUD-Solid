import { getSolidDataset, getThing, getUrl } from '@inrupt/solid-client';
import { getSessionFromStorage, Session } from '@inrupt/solid-client-authn-node';

const podInfoCache: { [sessionId: string]: PodInfo | null } = {};

async function getPodBaseUrl(sessionId: string): Promise<string | null> {

    const session = await getSessionFromStorage(sessionId);
    if (!session?.info.isLoggedIn) {
        console.error("Session is not logged in or does not exist.");
        return null;
    }

    try {
        // Método 2: Tentar extrair do WebID profile
        const profileDataset = await getSolidDataset(session.info.webId, { fetch: session.fetch });
        const profile = getThing(profileDataset, session.info.webId);

        if (profile) {
            // Tentar diferentes predicados comuns para storage
            const storage = getUrl(profile, 'http://www.w3.org/ns/pim/space#storage') ||
                getUrl(profile, 'http://www.w3.org/ns/solid/terms#storageSpace');

            if (storage) return storage;
        }

        // Método 3: Tentar derivar do WebID
        // Exemplo: https://username.inrupt.net/profile/card#me -> https://username.inrupt.net/
        const webIdUrl = new URL(session.info.webId);
        const baseUrl = `${webIdUrl.protocol}//${webIdUrl.hostname}/`;

        // Verificar se o baseUrl é acessível
        try {
            await session.fetch(baseUrl);
            return baseUrl;
        } catch {
            // Se não for acessível, não retornar
        }

        console.warn('Could not determine POD URL');
        return null;

    } catch (error) {
        console.error('Error getting pod URL:', error);
        return null;
    }
};


async function getPodInfo(sessionId: string): Promise<PodInfo | null> {
    const podUrl = await getPodBaseUrl(sessionId);
    if (!podUrl) return null;

    try {
        const url = new URL(podUrl);

        // Determinar o provedor
        let provider = 'unknown';
        if (url.hostname.includes('inrupt.com')) {
            provider = 'Inrupt';
        } else if (url.hostname.includes('solidcommunity.net')) {
            provider = 'Solid Community';
        }

        // Extrair username do hostname ou path
        const username = url.hostname.split('.')[0] ||
            url.pathname.split('/')[1] ||
            'unknown';

        return {
            baseUrl: podUrl,
            provider,
            username
        };
    } catch (error) {
        console.error('Error parsing pod info:', error);
        return null;
    }
}

export async function getPodInfoCached(sessionId: string): Promise<PodInfo | null> {

    if (podInfoCache[sessionId]) {
        return podInfoCache[sessionId];
    }

    const podInfo = await getPodInfo(sessionId);
    podInfoCache[sessionId] = podInfo;
    return podInfo;
}