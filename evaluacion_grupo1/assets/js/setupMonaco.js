
function setupMonacoValidation(monaco, editor) {
    // Habilitar sugerencias de HTML5
    monaco.languages.html.htmlDefaults.setOptions({
        suggest: {
            html5: true,
            angular1: false, // Desactivado para evitar ruido
            ionic: false     // Desactivado para evitar ruido
        }
    });

    const model = editor.getModel();

    function validate() {
        if (!window.HTMLHint) {
            console.warn("HTMLHint no está cargado. Saltando validación.");
            return;
        }

        const code = model.getValue();
        const hints = HTMLHint.verify(code, {
            'tag-pair': true,
            'attr-lowercase': true,
            'attr-no-duplication': true,
            'doctype-first': true,
            'tag-self-close': true,
            'spec-char-escape': true,
            'id-unique': true,
            'src-not-empty': true,
            'attr-value-not-empty': true,
            'alt-require': true,
            'head-script-disabled': false,
            'attr-unsafe-chars': true
        });

        const markers = hints.map(hint => ({
            startLineNumber: hint.line,
            endLineNumber: hint.line,
            startColumn: hint.col,
            endColumn: hint.evidence ? hint.col + hint.evidence.length : hint.col + 1,
            message: hint.message,
            severity: hint.type === 'error' ? monaco.MarkerSeverity.Error : monaco.MarkerSeverity.Warning
        }));

        monaco.editor.setModelMarkers(model, 'htmlhint', markers);
    }

    // Usar un debounce para no validar en cada pulsación
    let validationTimeout;
    model.onDidChangeContent(() => {
        clearTimeout(validationTimeout);
        validationTimeout = setTimeout(validate, 500);
    });

    validate(); // Validación inicial al cargar
}
