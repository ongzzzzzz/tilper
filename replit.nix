{ pkgs }: {
    deps = [
        pkgs.cowsay
		pkgs.busybox
		pkgs.python38Full
		pkgs.nodejs
		pkgs.gcc
    ];
}