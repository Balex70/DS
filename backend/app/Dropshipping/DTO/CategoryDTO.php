<?php
namespace App\Dropshipping\DTO;
readonly class CategoryDTO
{
    public function __construct(
        public string $id,
        public string $name,
        public ?string $parentId = null, // Added this
        /** @var self[] */
        public array $children = []
    ) {}

    public static function fromArray(array $data, ?string $parentId = null): self
    {
        // Identify the ID for the current level
        $currentId = $data['categoryFirstId'] ?? $data['categorySecondId'] ?? $data['categoryId'];
        $name = $data['categoryFirstName'] ?? $data['categorySecondName'] ?? $data['categoryName'];

        // Identify the nested list
        $list = $data['categoryFirstList'] ?? $data['categorySecondList'] ?? [];

        return new self(
            id: $currentId,
            name: $name,
            parentId: $parentId, // Assign the parent ID passed from the level above
            children: array_map(
                // Pass the current level's ID as the "parentId" for the next level
                fn($item) => self::fromArray($item, $currentId), 
                $list
            )
        );
    }
    
    public function flatten(): array
    {
        $flat = [$this];

        foreach ($this->children as $child) {
            $flat = array_merge($flat, $child->flatten());
        }

        return $flat;
    }
}
