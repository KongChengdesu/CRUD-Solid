import { getSessionFromStorage, getSessionIdFromStorageAll, Session } from "@inrupt/solid-client-authn-node";

export async function Login(req: any, res: any) {

    const session = new Session({keepAlive: true});
    req.session.sessionId = session.info.sessionId;

    const redirectToSolidIdentityProvider = (url: string) => {
        console.log(`Redirecting to ${url}`);
    }

    await session.login({

        redirectUrl: "http://localhost:3000/auth/callback",
        oidcIssuer: "https://inrupt.net",
        clientName: "Sollid CRUD Demo",
        handleRedirect: redirectToSolidIdentityProvider,

    });

}

export async function LoginCallback(req: any, res: any) {

    const sessionId = req.session.sessionId;
    const session = await getSessionFromStorage(sessionId);

    if (session) {
        const isLoggedIn = await session.handleIncomingRedirect(req.url);
        if (isLoggedIn) {
            console.log("Login successful");
            res.redirect("/");
        } else {
            console.log("Login failed");
            res.status(401).send("Login failed");
        }
    } else {
        console.log("Session not found");
        res.status(401).send("Session not found");
    }

}