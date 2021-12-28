# OmegaStore

An Open Source public file Hosting Platform. 

## How it works: 

- Create a folder called "files" in the cloned directory: `mkdir files`
- In the new created directory, create folders for the subdomains which you are planning to use. Example: files/test1 for test1.example.com, files/hello for hello.test.example.com
- We recommend running the application in a Docker container: `docker run -p 80:80 -v $(pwd)/files:/usr/src/app/files cb0be47aaad7`

### Fish Terminal

If you are using the Fish Shell, remove the `$` in `$(pwd)`