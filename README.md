# zd downloader

download all the attachments from a zendesk ticket to
`~/Downloads/support/<ticket-id>`

## install

- download the release for your os
- place it in `~/.local/bin`

## use

Specify the API key for `connect.posit.it` as an environment variable:
```shell
export ZD_CLI_CONNECT_API_KEY=your_key_here
```


```shell
❯ zd download --help                         

  Usage:   zd download <ticketId>
  Version: 0.3.1                 

  Description:

    download all attachments for a zendesk ticket

  Options:

    -h, --help  - Show this help. 
    -d, --dir   - specify download directory 

  Environment variables:

    ZD_CLI_CONNECT_API_KEY  <value>  - connect api key for connect.posit.it
```
