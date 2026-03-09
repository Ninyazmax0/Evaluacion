window.themeManager = {
    defineCustomThemes: function() {
        if (!window.monaco) return;
        
        monaco.editor.defineTheme('tokyo-night', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                { token: '', background: '1a1b26', foreground: 'a9b1d6' },
                { token: 'comment', foreground: '565f89', fontStyle: 'italic' },
                { token: 'keyword', foreground: 'bb9af7', fontStyle: 'bold' },
                { token: 'identifier', foreground: 'c0caf5' },
                { token: 'string', foreground: '9ece6a' },
                { token: 'number', foreground: 'ff9e64' },
                { token: 'delimiter', foreground: '89ddff' },
                { token: 'operator', foreground: '89ddff' },
                { token: 'type', foreground: '7aa2f7' },
                { token: 'function', foreground: '7aa2f7' },
                { token: 'class', foreground: '7aa2f7' },
                { token: 'variable', foreground: 'c0caf5' },
                { token: 'constant', foreground: 'ff9e64' },
                { token: 'regexp', foreground: 'bb9af7' },
                { token: 'tag', foreground: 'f7768e' },
                { token: 'attribute.name', foreground: 'bb9af7' },
                { token: 'attribute.value', foreground: '9ece6a' }
            ],
            colors: {
                'editor.background': '#1a1b26',
                'editor.foreground': '#a9b1d6',
                'editor.lineHighlightBackground': '#292e42',
                'editorCursor.foreground': '#c0caf5',
                'editorWhitespace.foreground': '#3b4261',
                'editorIndentGuide.background': '#292e42',
                'editorIndentGuide.activeBackground': '#3b4261',
                'editor.selectionBackground': '#33467C',
                'editor.inactiveSelectionBackground': '#33467C80'
            }
        });
    }
};
