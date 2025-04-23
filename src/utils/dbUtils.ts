export function getFolderNameFromUrl(url: string): string {

    const parts = url.split('/');
    while (parts.length > 0 && !parts[parts.length - 1]) {
        parts.pop();
    }
    return parts[parts.length - 1] || 'Root';

}

export function parseTurtleContent(content: string): TurtleData | null {
    try {
        const data: TurtleData = {
            properties: {},
        };

        // Detecta o tipo (a)
        const typeMatch = content.match(/a\s+<([^>]+)>/);
        if (typeMatch) {
            data.type = typeMatch[1];
        }

        // Encontra todas as propriedades e seus valores
        const propertyPattern = /<([^>]+)>\s*"([^"]+)"|<([^>]+)>\s+([^;\s]+)/g;
        let match;

        while ((match = propertyPattern.exec(content)) !== null) {
            const predicate = match[1] || match[3];
            const value = match[2] || match[4];

            // Simplifica o nome da propriedade
            const propertyName = predicate.split("/").pop() || predicate;

            // Se a propriedade já existe, converte para array
            if (data.properties[propertyName]) {
                if (Array.isArray(data.properties[propertyName])) {
                    (data.properties[propertyName] as string[]).push(value);
                } else {
                    data.properties[propertyName] = [
                        data.properties[propertyName] as string,
                        value,
                    ];
                }
            } else {
                data.properties[propertyName] = value;
            }
        }

        return data;
    } catch (error) {
        console.error("Error parsing Turtle data:", error);
        return null;
    }
};
