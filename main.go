package main

import (
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path"
)

func main() {
	res, err := http.Get("http://192.168.31.150:6200/test.json")
	// res, err := http.Get("https://raw.githubusercontent.com/2hacc/TVBox/main/oktv.json")

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

	dir := "output"
	_, err = os.Stat(dir)
	if err != nil {
		os.Mkdir(dir, 0700)
	}

	conf := "output/conf"
	_, err = os.Stat(conf)
	if err != nil {
		os.Mkdir(conf, 0700)
	}

	os.WriteFile(path.Join(conf, "ok.json"), body, 0700)

}
