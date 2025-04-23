import { getSessionFromStorage, Session } from "@inrupt/solid-client-authn-node";
import {
    getSolidDataset,
    getThing,
    setThing,
    getUrl,
    getContainedResourceUrlAll,
    saveSolidDatasetAt,
    createThing,
    createContainerAt,
    createSolidDataset,
    deleteSolidDataset,
    buildThing,
} from "@inrupt/solid-client";

import { getFolderNameFromUrl } from "../utils/dbUtils";
import { getPodInfoCached } from "./podInfoCache";

async function loadSession(sessionId: string): Promise<Session | null> {

    const session = await getSessionFromStorage(sessionId);
    if (!session?.info.isLoggedIn) {
        console.error("Session is not logged in or does not exist.");
        return null;
    }
    return session;

}

export async function getPodInfo(req: any, res: any) {

    const sessionId = req.headers['session-id'];
    const podInfo = await getPodInfoCached(sessionId);
    if (!podInfo) {
        return res.status(500).send("Error retrieving POD information.");
    }

    res.status(200).json(podInfo);
}


export async function loadFolderContent(req: any, res: any) {

    const sessionId = req.headers['session-id'];
    const session = await loadSession(sessionId);

    if (!session) {
        return res.status(401).send("User is not logged in.");
    }

    const folderUrl = req.query.folderUrl;

    try {
        console.log('Fetching folder:', folderUrl);

        const dataset = await getSolidDataset(folderUrl, {
            fetch: session.fetch
        });

        console.log('Dataset fetched:', dataset);

        const containedResources = getContainedResourceUrlAll(dataset);
        console.log('Contained resources:', containedResources);

        const items = await Promise.all(
            containedResources.map(async (resourceUrl) => {
                try {
                    const isFolder = resourceUrl.endsWith('/');
                    const name = getFolderNameFromUrl(resourceUrl);

                    return {
                        name,
                        url: resourceUrl,
                        isFolder
                    };
                } catch (error) {
                    console.warn(`Error processing resource ${resourceUrl}:`, error);
                    return null;
                }
            })
        );

        const validItems = items
            .filter((item): item is NonNullable<typeof item> => item !== null)
            .sort((a, b) => {
                // Ordenar pastas primeiro, depois arquivos
                if (a.isFolder && !b.isFolder) return -1;
                if (!a.isFolder && b.isFolder) return 1;
                return a.name.localeCompare(b.name);
            });

        const folder = {
            name: getFolderNameFromUrl(folderUrl),
            url: folderUrl,
            items: validItems
        } as FolderContent;

        res.status(200).json(folder);

    } catch (err) {
        console.error('Error loading folder:', err);
        res.status(500).send("Error loading folder content.");
    }
};



// Create a resource in the pod
export async function CreateResource(req: any, res: any) {

    const session = await getSessionFromStorage(req.headers['session-id']);
    const info = await getPodInfoCached(req.headers['session-id']);

    const folderUrl = req.body.folderUrl;
    const itemName = req.body.itemName;
    const itemType = req.body.itemType; // 'folder' or 'file'
    const itemContent = req.body.itemContent; // Content for the file, if applicable

    try {
        const newItemUrl = `${folderUrl}${itemName}${itemType === 'folder' ? '/' : ''}`;

        if (itemType === 'folder') {
            await createContainerAt(newItemUrl, { fetch: session.fetch });
        } else {
            const newDataset = createSolidDataset();
            const thing = buildThing(createThing())
                .addStringNoLocale(info!.baseUrl, itemContent || '')
                .build();

            console.log(thing)

            const datasetWithThing = setThing(newDataset, thing);
            await saveSolidDatasetAt(newItemUrl, datasetWithThing, { fetch: session.fetch });
        }

    } catch (err) {
        console.error('Error creating item:', err);
    }
}

// Read a resource from the pod
export async function ReadResource(req: any, res: any) {
    const session = await getSessionFromStorage(req.headers['session-id']);
    if (!session?.info.isLoggedIn) {
        return res.status(401).send("User is not logged in.");
    }

    const { resourceUrl } = req.query; // Expecting resourceUrl as a query parameter

    try {
        const response = await session.fetch(resourceUrl);
        const content = await response.text();
        res.status(200).send(content);
    } catch (err) {
        console.error('Error reading resource:', err);
        res.status(500).send("Error reading resource.");
    } finally {
    }
}

// Update a resource in the pod
export async function UpdateResource(req: any, res: any) {
    const session = await getSessionFromStorage(req.headers['session-id']);
    if (!session?.info.isLoggedIn) {
        return res.status(401).send("User is not logged in.");
    }

    const { resourceUrl, data } = req.body; // Expecting resourceUrl and data in the request body

    try {
        let dataset = await getSolidDataset(resourceUrl, { fetch: session.fetch });
        let thing = getThing(dataset, resourceUrl);

        if (!thing) {
            return res.status(404).send("Resource not found.");
        }

        thing = buildThing(thing)
            .setStringNoLocale("http://schema.org/name", data.name)
            .setStringNoLocale("http://schema.org/description", data.description)
            .build();

        dataset = setThing(dataset, thing);
        await saveSolidDatasetAt(resourceUrl, dataset, { fetch: session.fetch });

        res.status(200).send("Resource updated successfully.");
    } catch (error) {
        res.status(500).send(`Error updating resource: ${error.message}`);
    }
}

// Delete a resource from the pod
export async function DeleteResource(req: any, res: any) {
    const session = await getSessionFromStorage(req.headers['session-id']);
    if (!session?.info.isLoggedIn) {
        return res.status(401).send("User is not logged in.");
    }

    const { resourceUrl } = req.body; // Expecting resourceUrl in the request body

    try {
        await deleteSolidDataset(resourceUrl, { fetch: session.fetch });
        res.status(200).send("Resource deleted successfully.");
    } catch (error) {
        res.status(500).send(`Error deleting resource: ${error.message}`);
    }
}