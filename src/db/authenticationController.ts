import { Request, Response } from "express";
import { getSessionFromStorage, getSessionIdFromStorageAll, Session } from "@inrupt/solid-client-authn-node";

export async function Login(req: any, res: any) {

    const redirectUrl = req.body.redirectUrl;

    const session = new Session({
        keepAlive: true, 
    });


    const redirectToSolidIdentityProvider = (url: string) => {

        const loginInfo = {

            sessionId: session.info.sessionId,
            loginUrl: url
    
        }

        res.status(200).json(loginInfo);
        
    }

    await session.login({

        redirectUrl: redirectUrl,
        oidcIssuer: "https://login.inrupt.com",
        clientName: "Solid CRUD Demo",
        handleRedirect: redirectToSolidIdentityProvider,

    });

}

export async function LoginCallback(req: any, res: any) {

    const sessionId = req.headers['session-id'];
    const session = await getSessionFromStorage(sessionId);
    if (!session) {
        return res.status(401).send("Session not found or user is not logged in.");
    }
    
    const code = req.body.code;
    const state = req.body.state;
    const iss = req.body.iss;
    
    
    
    await session.handleIncomingRedirect(`
        http://localhost:3000/auth/callback?code=${code}&state=${state}&iss=${iss}`);
    if (session.info.isLoggedIn) {
        return res.status(200).send(`Logged in with the WebID ${session.info.webId}`)
    }

}