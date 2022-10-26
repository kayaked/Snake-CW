from bottle import static_file, route, run

@route('/<fn:path>')
def server_static(fn):
    return static_file(fn, root="C:/Users/ogane/Documents/snakecwh5/")

run(host='localhost', port=8080, debug=True)