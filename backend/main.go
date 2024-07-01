package main

import (
    "encoding/json"
    "log"
    "net/http"
    "os"
    "github.com/gorilla/mux"
    "github.com/joho/godotenv"
)

type SavingsAccount struct {
    ID      string  `json:"id"`
    Balance float64 `json:"balance"`
}

var savingsAccounts []SavingsAccount

func init() {
    if err := godotenv.Load(); err != nil {
        log.Print("No .env file found")
    }
}

func main() {
    r := mux.NewRouter()

    r.HandleFunc("/api/savings", getSavingsAccounts).Methods("GET")
    r.HandleFunc("/api/savings/{id}", getSavingsAccountByID).Methods("GET")
    r.HandleFunc("/api/savings", createSavingsAccount).Methods("POST")
    r.HandleFunc("/api/savings/{id}", updateSavingsAccount).Methods("PUT")
    r.HandleFunc("/api/savings/{id}", deleteSavingsAccount).Methods("DELETE")

    port := os.Getenv("PORT")
    if port == "" {
        port = "8080" 
    }

    log.Fatal(http.ListenAndServe(":"+port, r))
}

func getSavingsAccounts(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(savingsAccounts)
}

func getSavingsAccountByID(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    params := mux.Vars(r) 
    for _, item := range savingsAccounts {
        if item.ID == params["id"] {
            json.NewEncoder(w).Encode(item)
            return
        }
    }
    http.NotFound(w, r)
}

func createSavingsAccount(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    var savingsAccount SavingsAccount
    if err := json.NewDecoder(r.Body).Decode(&savingsAccount); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }
    savingsAccounts = append(savingsAccounts, savingsAccount)
    json.NewEncoder(w).Encode(savingsAccount)
}

func updateSavingsAccount(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    params := mux.Vars(r)
    for index, item := range savingsAccounts {
        if item.ID == params["id"] {
            savingsAccounts = append(savingsAccounts[:index], savingsAccounts[index+1:]...)
            var updatedAccount SavingsAccount
            if err := json.NewDecoder(r.Body).Decode(&updatedAccount); err != nil {
                http.Error(w, err.Error(), http.StatusBadRequest)
                return
            }
            updatedAccount.ID = params["id"] 
            savingsAccounts = append(savingsAccounts, updatedAccount)
            json.NewEncoder(w).Encode(updatedAccount)
            return
        }
    }
    http.NotFound(w, r)
}

func deleteSavingsAccount(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    params := mux.Vars(r)
    for index, item := range savingsAccounts {
        if item.ID == params["id"] {
            savingsAccounts = append(savingsAccounts[:index], savingsAccounts[index+1:]...)
            break
        }
    }
    w.WriteHeader(http.StatusNoContent)
}