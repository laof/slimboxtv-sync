package main

import (
	"io/ioutil"
	"log"
	"net/http"
	"os"
)

func main() {
	// res, err := http.Get("http://192.168.31.150:6200/test.json")
	res, err := http.Get("https://raw.githubusercontent.com/2hacc/TVBox/main/oktv.json")

	if err != nil {
		log.Fatalln("http error: " + err.Error())
		return
	}

	defer res.Body.Close()

	body, err := ioutil.ReadAll(res.Body)

	if err != nil {
		log.Fatalln("ReadAll error: " + err.Error())
		return
	}

	f := "output/ok.json"

	os.WriteFile(f, body, 0644)

}
