# Validate JSON
# usage args: JSON_FILE

# Prints JSON decoder errors or nothing if JSON is correct

if __name__ == '__main__':
    import json
    import sys

    try:
        with open(sys.argv[1]) as f:
            t = f.read()
            j = json.loads(t)
    except IndexError:
        import __main__
        print(f'usage: python3 {__main__.__file__} JSON_FILE')
