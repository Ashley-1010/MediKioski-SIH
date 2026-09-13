from pathlib import Path
def extract_text(path: Path, mime: str) -> str:
    """Best-effort local extraction. PDF text extraction works without an external OCR binary.
    Image OCR can be enabled in production by installing/configuring Tesseract or a managed OCR service."""
    if mime == "application/pdf":
        try:
            from pypdf import PdfReader
            return "\n".join((p.extract_text() or "") for p in PdfReader(str(path)).pages).strip()
        except Exception:
            return ""
    return ""
