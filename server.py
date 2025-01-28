#!/usr/bin/env python3
import http.server
import socketserver
import ssl

cert_file = "cert/localhost.pem"
key_file = "cert/localhost-key.pem"

class RequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

context = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
context.load_cert_chain(certfile=cert_file, keyfile=key_file)

httpd = http.server.HTTPServer(('localhost', 8080), RequestHandler)

httpd.socket = context.wrap_socket(httpd.socket, server_side=True)

print("Serving on https://localhost:8080")
httpd.serve_forever()