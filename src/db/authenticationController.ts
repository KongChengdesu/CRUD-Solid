import { Request, Response } from "express";
import { getSessionFromStorage, getSessionIdFromStorageAll, Session } from "@inrupt/solid-client-authn-node";

export async function Login(req: any, res: any) {

    const sessionId = req.body.sessionId;
    const session = new Session({
        keepAlive: true, 
        sessionInfo: {
            sessionId: sessionId, 
            isLoggedIn: false
        }
    });

    const redirectToSolidIdentityProvider = (url: string) => {
        res.status(200).send(url);
    }

    await session.login({

        redirectUrl: `http://localhost:3000/auth/callback?sessionId=${sessionId}`,
        oidcIssuer: "https://login.inrupt.com",
        clientName: "Solid CRUD Demo",
        handleRedirect: redirectToSolidIdentityProvider,

    });

}

export async function LoginCallback(req: any, res: any) {

    const sessionId = req.query.sessionId;
    const session = await getSessionFromStorage(sessionId);
    await session.handleIncomingRedirect(`http://localhost:3000/auth${req.url}`);
    if (session.info.isLoggedIn) {
        return res.send(`<p>Logged in with the WebID ${session.info.webId}.</p>`)
    }

}