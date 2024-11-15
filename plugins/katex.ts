import katex from 'katex';

export default defineNuxtPlugin(() => {
    return {
        provide: {
            renderMathString: (msg: string, options: { mode: string; }) => {
                if (!msg) return msg;
                msg = String(msg);

                const regexGlossary = /\[([^\]]+)]\(([^)]+)\)/g;
                msg = msg.replace(regexGlossary, (match, p1, p2) => {
                    const urlFragment = p2.replace(/\s+/g, '-')
                    return `<a class="hover:underline italic" href="/glossary#${urlFragment}">${p1}<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3 text-gray-500 inline align-text-top"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"></path></svg></a>`;
                });

                if (options && options.mode === 'block') {
                    // remove $ and $$ 
                    msg = msg.replace(/\$/g, '');

                    return katex.renderToString(msg, {
                        throwOnError: false,
                    });
                }

                // only render if there is a $ in the string
                if (msg.indexOf('$') === -1) return msg;

                // render only text between $...$
                const regex = /\$(.*?)\$/g;
                const matches = msg.match(regex);
                if (matches) {
                    matches.forEach(match => {
                        const math = match.replace(/\$/g, '');
                        msg = msg.replace(match, katex.renderToString(math, {
                            throwOnError: false,
                        }));
                    });
                }
                return msg;

            },
        }
    }
})