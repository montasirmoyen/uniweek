#!/usr/bin/env python3
import json
import sys
import urllib.request
import ssl
from html.parser import HTMLParser
from typing import Optional

try:
    import certifi

    CA_FILE = certifi.where()
except Exception:
    CA_FILE = None

URL = "https://www.suffolk.edu/"

class AlertParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.in_alert = False
        self.depth = 0
        self.current_field: Optional[str] = None
        self.data = {"date": "", "message": ""}
        self.message_active = False
        self.message_done = False

    def handle_starttag(self, tag: str, attrs) -> None:
        attrs_dict = dict(attrs)

        if tag == "div" and attrs_dict.get("id") == "globalAlert":
            self.in_alert = True
            self.depth = 0
            self.current_field = None
            return

        if self.in_alert:
            if tag == "div":
                classes = attrs_dict.get("class", "").split()
                if "date" in classes:
                    self.current_field = "date"
                elif "message" in classes and not self.message_done:
                    self.current_field = "message"
                    self.message_active = True
            self.depth += 1

    def handle_endtag(self, tag: str) -> None:
        if not self.in_alert:
            return

        if self.current_field and tag in ("div", "span", "p"):
            self.current_field = None

        if tag == "div" and self.message_active:
            # Close message capture once the message div ends so we ignore any other "message" classes elsewhere.
            self.message_active = False
            self.message_done = True

        if tag == "div":
            if self.depth > 0:
                self.depth -= 1
            else:
                self.in_alert = False

    def handle_data(self, data: str) -> None:
        if self.in_alert and self.current_field and data.strip():
            if self.current_field == "message" and not self.message_active:
                return
            self.data[self.current_field] += data.strip() + " "


def build_ssl_context() -> ssl.SSLContext:
    # Prefer certifi bundle when available to avoid local trust issues.
    if CA_FILE:
        return ssl.create_default_context(cafile=CA_FILE)
    return ssl.create_default_context()


def fetch_html(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=8, context=build_ssl_context()) as resp:
        charset = resp.headers.get_content_charset() or "utf-8"
        return resp.read().decode(charset, errors="replace")


def fetch_alert():
    try:
        html = fetch_html(URL)
    except Exception as exc:  # pragma: no cover - network errors
        return {"has_alert": False, "error": f"fetch failed: {exc}"}

    parser = AlertParser()
    parser.feed(html)
    cleaned = {k: v.strip() or None for k, v in parser.data.items()}
    has_alert = any(cleaned.values())

    return {
        "has_alert": bool(has_alert),
        "date": cleaned.get("date"),
        "message": cleaned.get("message"),
    }


if __name__ == "__main__":
    result = fetch_alert()
    json.dump(result, sys.stdout)
