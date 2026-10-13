
from fact_checker import analyze_claim


def main():
    print("Welcome to AI Fact Checker!")
    print("Enter a claim to verify.")

    claim = input("> ")

    result = analyze_claim(claim)

    print("\nClaim:", result["claim"])
    print("Status:", result["status"])
    print("Explanation:", result["explanation"])

    sources = result.get("sources", [])

    if sources:
        print("\nSources found:")

        for index, source in enumerate(sources, start=1):
            print(f"\nSource {index}:")
            print("Title:", source["title"])
            print("URL:", source["url"])
            print("Content:", source["content"])

    else:
        print("\nNo sources available.")


if __name__ == "__main__":
    main()