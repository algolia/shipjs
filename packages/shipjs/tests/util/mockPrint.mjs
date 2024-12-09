export function mockPrint(print, output) {
  print.mockImplementation((...args) => {
    output.push(args.join(' '));
  });
}
