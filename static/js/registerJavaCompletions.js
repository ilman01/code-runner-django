let javaCompletionsRegistered = false;
window.registerJavaCompletions = registerJavaCompletions;
function registerJavaCompletions() {
    if (javaCompletionsRegistered) return;   // guard against double registration
    javaCompletionsRegistered = true;

    const K = monaco.languages.CompletionItemKind;
    const SNIP = monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet;


    const J = {};
    const def = (name, pkg, o = {}) => (J[name] = { name, pkg, p: [], ext: [], s: [], m: [], ...o });

// Priority: classes/members used in Solution4-7 + Template7
const USED_CLASSES = new Set([
  "BufferedReader", "InputStreamReader", "PrintWriter", "StringTokenizer", "InputStream",
  "OutputStream", "IOException", "StringBuilder", "RuntimeException", "IllegalStateException",
  "IllegalArgumentException", "ArrayList", "Math", "Integer", "Long", "String", "System",
  "Object", "InputReader",
]);
const USED_MEMBERS = new Set([
  "println", "print", "printf", "close", "flush", "readLine", "nextToken", "hasMoreTokens",
  "parseInt", "parseLong", "append", "compareTo", "compare", "equals", "charAt", "indexOf",
  "max", "min", "add", "get", "set", "remove", "size", "isEmpty", "length", "toString",
  "next", "nextInt", "nextInteger", "nextLong", "insert", "clear", "valueOf", "swap", "sort",
]);

// ---- Your custom classes (in / out) ----
def("InputReader", "custom", {
  m: ["String next()", "int nextInt()", "int nextInteger()", "long nextLong()",
      "double nextDouble()", "String nextLine()", "BufferedReader reader", "StringTokenizer tokenizer"],
});

// ---- java.lang ----
def("Object", "java.lang", { m: ["boolean equals(Object o)", "int hashCode()", "String toString()", "Class getClass()"] });
def("Class", "java.lang", { m: ["String getName()", "String getSimpleName()"] });
def("CharSequence", "java.lang", { i: 1, m: ["int length()", "char charAt(int index)", "CharSequence subSequence(int start, int end)", "boolean isEmpty()", "String toString()"] });
def("Comparable", "java.lang", { i: 1, p: ["T"], m: ["int compareTo(T o)"] });
def("Iterable", "java.lang", { i: 1, p: ["E"], m: ["Iterator<E> iterator()", "void forEach(Consumer<E> action)"] });
def("Runnable", "java.lang", { i: 1, m: ["void run()"] });
def("AutoCloseable", "java.lang", { i: 1, m: ["void close()"] });

def("String", "java.lang", {
  ext: ["CharSequence"],
  s: ["String valueOf(Object o)", "String valueOf(char[] data)", "String format(String format, Object... args)",
      "String join(CharSequence delimiter, Object... parts)", "String copyValueOf(char[] data)",
      "Comparator<String> CASE_INSENSITIVE_ORDER"],
  m: ["int length()", "char charAt(int index)", "boolean isEmpty()", "boolean isBlank()",
      "String substring(int begin)", "String substring(int begin, int end)",
      "int indexOf(String s)", "int indexOf(String s, int from)", "int indexOf(int ch)",
      "int lastIndexOf(String s)", "int lastIndexOf(int ch)",
      "boolean equalsIgnoreCase(String s)", "int compareTo(String s)", "int compareToIgnoreCase(String s)",
      "boolean contains(CharSequence s)", "boolean startsWith(String prefix)", "boolean endsWith(String suffix)",
      "String trim()", "String strip()", "String stripLeading()", "String stripTrailing()",
      "String toUpperCase()", "String toLowerCase()", "String replace(CharSequence a, CharSequence b)",
      "String replaceAll(String regex, String replacement)", "String replaceFirst(String regex, String replacement)",
      "String[] split(String regex)", "String[] split(String regex, int limit)", "char[] toCharArray()",
      "String concat(String s)", "String repeat(int count)", "boolean matches(String regex)",
      "String intern()", "byte[] getBytes()", "int codePointAt(int index)", "String formatted(Object... args)",
      "IntStream chars()", "Stream<String> lines()", "boolean contentEquals(CharSequence cs)"],
});
const SB = {
  ext: ["CharSequence"],
  m: ["this append(Object x)", "this append(char c)", "this append(String s)", "this appendCodePoint(int cp)",
      "this insert(int offset, Object x)", "this reverse()", "this deleteCharAt(int index)",
      "this delete(int start, int end)", "this replace(int start, int end, String s)",
      "void setLength(int newLength)", "void setCharAt(int index, char c)", "char charAt(int index)",
      "int length()", "int capacity()", "void ensureCapacity(int min)", "int indexOf(String s)",
      "int lastIndexOf(String s)", "String substring(int start)", "String substring(int start, int end)",
      "boolean isEmpty()", "int compareTo(StringBuilder o)", "String toString()"],
};
def("StringBuilder", "java.lang", SB);
def("StringBuffer", "java.lang", SB);

const NUM = ["int intValue()", "long longValue()", "double doubleValue()", "float floatValue()", "short shortValue()", "byte byteValue()"];
def("Number", "java.lang", { m: NUM });
def("Integer", "java.lang", {
  ext: ["Number"],
  s: ["int MAX_VALUE", "int MIN_VALUE", "int SIZE", "int BYTES",
      "int parseInt(String s)", "int parseInt(String s, int radix)", "Integer valueOf(int i)", "Integer valueOf(String s)",
      "String toString(int i)", "String toString(int i, int radix)", "String toBinaryString(int i)",
      "String toHexString(int i)", "String toOctalString(int i)", "int compare(int x, int y)",
      "int max(int a, int b)", "int min(int a, int b)", "int sum(int a, int b)", "int signum(int i)",
      "int bitCount(int i)", "int reverse(int i)", "int highestOneBit(int i)", "int lowestOneBit(int i)",
      "int numberOfLeadingZeros(int i)", "int numberOfTrailingZeros(int i)", "int hashCode(int value)",
      "int parseUnsignedInt(String s)", "int divideUnsigned(int a, int b)", "int remainderUnsigned(int a, int b)",
      "int compareUnsigned(int x, int y)", "int rotateLeft(int i, int d)", "int rotateRight(int i, int d)"],
  m: ["int compareTo(Integer o)"],
});
def("Long", "java.lang", {
  ext: ["Number"],
  s: ["long MAX_VALUE", "long MIN_VALUE", "int SIZE", "int BYTES",
      "long parseLong(String s)", "long parseLong(String s, int radix)", "Long valueOf(long l)", "Long valueOf(String s)",
      "String toString(long l)", "String toString(long l, int radix)", "String toBinaryString(long l)",
      "String toHexString(long l)", "String toOctalString(long l)", "int compare(long x, long y)",
      "long max(long a, long b)", "long min(long a, long b)", "long sum(long a, long b)", "int signum(long l)",
      "int bitCount(long l)", "long reverse(long l)", "long highestOneBit(long l)", "long lowestOneBit(long l)",
      "int numberOfLeadingZeros(long l)", "int numberOfTrailingZeros(long l)", "int hashCode(long value)",
      "long divideUnsigned(long a, long b)", "long remainderUnsigned(long a, long b)"],
  m: ["int compareTo(Long o)"],
});
def("Short", "java.lang", { ext: ["Number"], s: ["short MAX_VALUE", "short MIN_VALUE", "short parseShort(String s)", "Short valueOf(short s)"] });
def("Byte", "java.lang", { ext: ["Number"], s: ["byte MAX_VALUE", "byte MIN_VALUE", "byte parseByte(String s)", "Byte valueOf(byte b)"] });
def("Float", "java.lang", { ext: ["Number"], s: ["float MAX_VALUE", "float MIN_VALUE", "float parseFloat(String s)", "Float valueOf(float f)", "int compare(float a, float b)", "boolean isNaN(float f)"] });
def("Double", "java.lang", {
  ext: ["Number"],
  s: ["double MAX_VALUE", "double MIN_VALUE", "double POSITIVE_INFINITY", "double NEGATIVE_INFINITY", "double NaN",
      "double parseDouble(String s)", "Double valueOf(double d)", "Double valueOf(String s)", "String toString(double d)",
      "int compare(double a, double b)", "boolean isNaN(double d)", "boolean isInfinite(double d)", "boolean isFinite(double d)",
      "double sum(double a, double b)", "double max(double a, double b)", "double min(double a, double b)",
      "long doubleToLongBits(double d)", "double longBitsToDouble(long bits)"],
  m: ["boolean isNaN()", "boolean isInfinite()", "int compareTo(Double o)"],
});
def("Boolean", "java.lang", {
  s: ["Boolean TRUE", "Boolean FALSE", "boolean parseBoolean(String s)", "Boolean valueOf(boolean b)", "String toString(boolean b)",
      "int compare(boolean a, boolean b)", "boolean logicalAnd(boolean a, boolean b)", "boolean logicalOr(boolean a, boolean b)", "boolean logicalXor(boolean a, boolean b)"],
  m: ["boolean booleanValue()", "int compareTo(Boolean o)"],
});
def("Character", "java.lang", {
  s: ["char MAX_VALUE", "char MIN_VALUE", "boolean isDigit(char c)", "boolean isLetter(char c)", "boolean isLetterOrDigit(char c)",
      "boolean isAlphabetic(int cp)", "boolean isUpperCase(char c)", "boolean isLowerCase(char c)", "boolean isWhitespace(char c)",
      "char toUpperCase(char c)", "char toLowerCase(char c)", "int getNumericValue(char c)", "int digit(char c, int radix)",
      "char forDigit(int digit, int radix)", "Character valueOf(char c)", "String toString(char c)", "int compare(char x, char y)",
      "char[] toChars(int cp)"],
  m: ["char charValue()", "int compareTo(Character o)"],
});
def("Math", "java.lang", {
  s: ["double PI", "double E",
      "int abs(int a)", "long abs(long a)", "double abs(double a)",
      "int max(int a, int b)", "long max(long a, long b)", "double max(double a, double b)",
      "int min(int a, int b)", "long min(long a, long b)", "double min(double a, double b)",
      "double pow(double a, double b)", "double sqrt(double a)", "double cbrt(double a)", "double floor(double a)",
      "double ceil(double a)", "long round(double a)", "double rint(double a)", "double random()",
      "double log(double a)", "double log10(double a)", "double exp(double a)",
      "double sin(double a)", "double cos(double a)", "double tan(double a)", "double asin(double a)",
      "double acos(double a)", "double atan(double a)", "double atan2(double y, double x)", "double hypot(double x, double y)",
      "double signum(double d)", "int floorDiv(int x, int y)", "long floorDiv(long x, long y)",
      "int floorMod(int x, int y)", "long floorMod(long x, long y)", "int ceilDiv(int x, int y)",
      "int addExact(int x, int y)", "long addExact(long x, long y)", "int subtractExact(int x, int y)",
      "long subtractExact(long x, long y)", "int multiplyExact(int x, int y)", "long multiplyExact(long x, long y)",
      "int negateExact(int a)", "int toIntExact(long value)", "double toRadians(double deg)", "double toDegrees(double rad)",
      "int clamp(long value, int min, int max)", "double fma(double a, double b, double c)"],
});
def("System", "java.lang", {
  s: ["PrintStream out", "PrintStream err", "InputStream in", "long currentTimeMillis()", "long nanoTime()",
      "void exit(int status)", "void arraycopy(Object src, int srcPos, Object dest, int destPos, int length)",
      "String getProperty(String key)", "String getenv(String name)", "String lineSeparator()", "void gc()",
      "int identityHashCode(Object x)", "void setIn(InputStream in)", "void setOut(PrintStream out)", "void setErr(PrintStream err)"],
});
def("Runtime", "java.lang", { s: ["Runtime getRuntime()"], m: ["long totalMemory()", "long freeMemory()", "long maxMemory()", "int availableProcessors()", "void gc()"] });
def("Thread", "java.lang", { ext: ["Runnable"], s: ["void sleep(long millis)", "Thread currentThread()"], m: ["void start()", "void join()", "void interrupt()", "String getName()", "void setDaemon(boolean on)", "boolean isAlive()", "long getId()"] });
def("StackTraceElement", "java.lang", { m: ["String getMethodName()", "String getClassName()", "int getLineNumber()"] });

// ---- Exceptions ----
def("Throwable", "java.lang", {
  m: ["String getMessage()", "String getLocalizedMessage()", "Throwable getCause()", "Throwable initCause(Throwable cause)",
      "void printStackTrace()", "StackTraceElement[] getStackTrace()", "void addSuppressed(Throwable t)"],
});
[
  ["Exception", "java.lang", "Throwable"], ["Error", "java.lang", "Throwable"],
  ["RuntimeException", "java.lang", "Exception"], ["IOException", "java.io", "Exception"],
  ["IllegalStateException", "java.lang", "RuntimeException"], ["IllegalArgumentException", "java.lang", "RuntimeException"],
  ["NumberFormatException", "java.lang", "IllegalArgumentException"], ["ArithmeticException", "java.lang", "RuntimeException"],
  ["NullPointerException", "java.lang", "RuntimeException"], ["ClassCastException", "java.lang", "RuntimeException"],
  ["IndexOutOfBoundsException", "java.lang", "RuntimeException"], ["ArrayIndexOutOfBoundsException", "java.lang", "IndexOutOfBoundsException"],
  ["StringIndexOutOfBoundsException", "java.lang", "IndexOutOfBoundsException"], ["NegativeArraySizeException", "java.lang", "RuntimeException"],
  ["UnsupportedOperationException", "java.lang", "RuntimeException"], ["InterruptedException", "java.lang", "Exception"],
  ["CloneNotSupportedException", "java.lang", "Exception"], ["StackOverflowError", "java.lang", "Error"],
  ["OutOfMemoryError", "java.lang", "Error"], ["AssertionError", "java.lang", "Error"],
  ["NoSuchElementException", "java.util", "RuntimeException"], ["InputMismatchException", "java.util", "NoSuchElementException"],
  ["ConcurrentModificationException", "java.util", "RuntimeException"], ["EmptyStackException", "java.util", "RuntimeException"],
  ["FileNotFoundException", "java.io", "IOException"], ["EOFException", "java.io", "IOException"],
  ["UncheckedIOException", "java.io", "RuntimeException"], ["DateTimeException", "java.time", "RuntimeException"],
].forEach(([n, pkg, parent]) => def(n, pkg, { ext: [parent] }));

// ---- java.io ----
const PRINT = [
  "void println()", "void println(Object x)", "void print(Object x)",
  "this printf(String format, Object... args)", "this format(String format, Object... args)",
  "this append(CharSequence s)", "void write(int c)", "void write(String s)",
  "void flush()", "void close()", "boolean checkError()",
];
def("InputStream", "java.io", { ext: ["AutoCloseable"], m: ["int read()", "int read(byte[] b)", "int available()", "long skip(long n)", "byte[] readAllBytes()", "void close()", "void mark(int readlimit)", "void reset()"] });
def("OutputStream", "java.io", { ext: ["AutoCloseable"], m: ["void write(int b)", "void write(byte[] b)", "void flush()", "void close()"] });
def("PrintStream", "java.io", { ext: ["OutputStream"], m: PRINT });
def("PrintWriter", "java.io", { ext: ["Writer"], m: PRINT });
def("Reader", "java.io", { ext: ["AutoCloseable"], m: ["int read()", "int read(char[] buf)", "boolean ready()", "long skip(long n)", "void close()"] });
def("Writer", "java.io", { ext: ["AutoCloseable"], m: ["void write(int c)", "void write(String s)", "this append(CharSequence s)", "void flush()", "void close()"] });
def("InputStreamReader", "java.io", { ext: ["Reader"], m: ["String getEncoding()"] });
def("FileReader", "java.io", { ext: ["InputStreamReader"] });
def("BufferedReader", "java.io", { ext: ["Reader"], m: ["String readLine()", "Stream<String> lines()", "void mark(int readAheadLimit)", "void reset()"] });
def("OutputStreamWriter", "java.io", { ext: ["Writer"] });
def("FileWriter", "java.io", { ext: ["OutputStreamWriter"] });
def("BufferedWriter", "java.io", { ext: ["Writer"], m: ["void newLine()"] });
def("BufferedInputStream", "java.io", { ext: ["InputStream"] });
def("BufferedOutputStream", "java.io", { ext: ["OutputStream"] });
def("DataInputStream", "java.io", { ext: ["InputStream"], m: ["int readInt()", "long readLong()", "double readDouble()", "char readChar()", "boolean readBoolean()", "String readLine()"] });
def("DataOutputStream", "java.io", { ext: ["OutputStream"], m: ["void writeInt(int v)", "void writeLong(long v)", "void writeDouble(double v)", "void writeChar(int v)", "void writeBytes(String s)"] });
def("ByteArrayInputStream", "java.io", { ext: ["InputStream"] });
def("ByteArrayOutputStream", "java.io", { ext: ["OutputStream"], m: ["byte[] toByteArray()", "int size()", "void reset()", "String toString()"] });
def("File", "java.io", { m: ["boolean exists()", "String getName()", "String getPath()", "boolean isFile()", "boolean isDirectory()", "long length()", "boolean delete()", "File[] listFiles()"] });
def("StreamTokenizer", "java.io", {
  s: ["int TT_EOF", "int TT_EOL", "int TT_NUMBER", "int TT_WORD"],
  m: ["int ttype", "double nval", "String sval", "int nextToken()", "void resetSyntax()", "void whitespaceChars(int low, int hi)",
      "void wordChars(int low, int hi)", "void ordinaryChar(int ch)", "void ordinaryChars(int low, int hi)", "void parseNumbers()",
      "void eolIsSignificant(boolean flag)", "void pushBack()", "int lineno()"],
});

// ---- java.util: tokenizer / scanner / misc ----
def("StringTokenizer", "java.util", { m: ["boolean hasMoreTokens()", "String nextToken()", "String nextToken(String delim)", "int countTokens()", "boolean hasMoreElements()", "Object nextElement()"] });
def("Scanner", "java.util", {
  ext: ["AutoCloseable"],
  m: ["String next()", "int nextInt()", "long nextLong()", "double nextDouble()", "boolean nextBoolean()", "String nextLine()",
      "BigInteger nextBigInteger()", "boolean hasNext()", "boolean hasNextInt()", "boolean hasNextLong()", "boolean hasNextDouble()",
      "boolean hasNextLine()", "this useDelimiter(String pattern)", "void close()"],
});
def("StringJoiner", "java.util", { m: ["this add(CharSequence s)", "int length()", "this setEmptyValue(CharSequence s)", "String toString()"] });
def("Random", "java.util", {
  m: ["int nextInt()", "int nextInt(int bound)", "int nextInt(int origin, int bound)", "long nextLong()", "double nextDouble()",
      "boolean nextBoolean()", "double nextGaussian()", "void setSeed(long seed)", "void nextBytes(byte[] bytes)", "IntStream ints(long size, int origin, int bound)"],
});
def("ThreadLocalRandom", "java.util.concurrent", { ext: ["Random"], s: ["ThreadLocalRandom current()"] });
def("Objects", "java.util", {
  s: ["boolean equals(Object a, Object b)", "int hash(Object... values)", "int hashCode(Object o)", "String toString(Object o)",
      "Object requireNonNull(Object o)", "boolean isNull(Object o)", "boolean nonNull(Object o)", "Object requireNonNullElse(Object o, Object def)",
      "int checkIndex(int index, int length)", "int compare(Object a, Object b, Comparator c)"],
});
def("Optional", "java.util", {
  p: ["T"],
  s: ["Optional of(Object value)", "Optional empty()", "Optional ofNullable(Object value)"],
  m: ["boolean isPresent()", "boolean isEmpty()", "T get()", "T orElse(T other)", "T orElseGet(Supplier<T> s)", "T orElseThrow()",
      "void ifPresent(Consumer<T> action)", "Optional map(Function<T,R> f)", "Optional<T> filter(Predicate<T> p)"],
});
def("OptionalInt", "java.util", { m: ["boolean isPresent()", "int getAsInt()", "int orElse(int other)"] });
def("OptionalDouble", "java.util", { m: ["boolean isPresent()", "double getAsDouble()", "double orElse(double other)"] });
def("BitSet", "java.util", {
  m: ["void set(int i)", "void set(int from, int to)", "boolean get(int i)", "void clear(int i)", "void clear()", "void flip(int i)",
      "int cardinality()", "int nextSetBit(int from)", "int nextClearBit(int from)", "int previousSetBit(int from)", "int length()", "int size()",
      "boolean isEmpty()", "void and(BitSet o)", "void or(BitSet o)", "void xor(BitSet o)", "void andNot(BitSet o)"],
});
def("Locale", "java.util", { s: ["Locale US", "Locale ROOT", "Locale ENGLISH", "Locale getDefault()"] });
def("AtomicInteger", "java.util.concurrent.atomic", { ext: ["Number"], m: ["int get()", "void set(int v)", "int incrementAndGet()", "int getAndIncrement()", "int decrementAndGet()", "int addAndGet(int d)", "int getAndAdd(int d)"] });
def("AtomicLong", "java.util.concurrent.atomic", { ext: ["Number"], m: ["long get()", "void set(long v)", "long incrementAndGet()", "long getAndIncrement()", "long addAndGet(long d)"] });

// ---- Collections ----
def("Iterator", "java.util", { i: 1, p: ["E"], m: ["boolean hasNext()", "E next()", "void remove()"] });
def("Collection", "java.util", {
  i: 1, p: ["E"], ext: ["Iterable"],
  m: ["boolean add(E e)", "boolean remove(Object o)", "int size()", "boolean isEmpty()", "void clear()", "boolean contains(Object o)",
      "boolean addAll(Collection<E> c)", "boolean removeAll(Collection<?> c)", "boolean retainAll(Collection<?> c)", "boolean containsAll(Collection<?> c)",
      "boolean removeIf(Predicate<E> p)", "Stream<E> stream()", "Object[] toArray()", "Iterator<E> iterator()"],
});
def("List", "java.util", {
  i: 1, p: ["E"], ext: ["Collection"],
  s: ["List of(Object... elements)", "List copyOf(Collection<?> c)"],
  m: ["E get(int index)", "E set(int index, E e)", "void add(int index, E e)", "E remove(int index)", "boolean addAll(int index, Collection<E> c)",
      "int indexOf(Object o)", "int lastIndexOf(Object o)", "List<E> subList(int from, int to)", "void sort(Comparator<E> c)",
      "void replaceAll(UnaryOperator<E> op)", "E getFirst()", "E getLast()", "E removeFirst()", "E removeLast()", "void addFirst(E e)",
      "void addLast(E e)", "List<E> reversed()", "ListIterator<E> listIterator()"],
});
def("ListIterator", "java.util", { i: 1, p: ["E"], ext: ["Iterator"], m: ["boolean hasPrevious()", "E previous()", "void set(E e)", "void add(E e)", "int nextIndex()", "int previousIndex()"] });
def("ArrayList", "java.util", { p: ["E"], ext: ["List"], m: ["void ensureCapacity(int min)", "void trimToSize()", "Object clone()"] });
def("CopyOnWriteArrayList", "java.util.concurrent", { p: ["E"], ext: ["List"] });
def("Vector", "java.util", { p: ["E"], ext: ["List"] });
def("Queue", "java.util", { i: 1, p: ["E"], ext: ["Collection"], m: ["boolean offer(E e)", "E poll()", "E peek()", "E element()", "E remove()"] });
def("Deque", "java.util", {
  i: 1, p: ["E"], ext: ["Queue"],
  m: ["void addFirst(E e)", "void addLast(E e)", "boolean offerFirst(E e)", "boolean offerLast(E e)", "E pollFirst()", "E pollLast()",
      "E peekFirst()", "E peekLast()", "E getFirst()", "E getLast()", "E removeFirst()", "E removeLast()", "void push(E e)", "E pop()",
      "Iterator<E> descendingIterator()", "boolean removeFirstOccurrence(Object o)"],
});
def("ArrayDeque", "java.util", { p: ["E"], ext: ["Deque"] });
def("LinkedList", "java.util", { p: ["E"], ext: ["List", "Deque"] });
def("PriorityQueue", "java.util", { p: ["E"], ext: ["Queue"], m: ["Comparator<E> comparator()"] });
def("Stack", "java.util", { p: ["E"], ext: ["Vector"], m: ["E push(E item)", "E pop()", "E peek()", "boolean empty()", "int search(Object o)"] });
def("Set", "java.util", { i: 1, p: ["E"], ext: ["Collection"], s: ["Set of(Object... elements)", "Set copyOf(Collection<?> c)"] });
def("HashSet", "java.util", { p: ["E"], ext: ["Set"] });
def("LinkedHashSet", "java.util", { p: ["E"], ext: ["Set"] });
def("SortedSet", "java.util", { i: 1, p: ["E"], ext: ["Set"], m: ["E first()", "E last()", "TreeSet<E> headSet(E to)", "TreeSet<E> tailSet(E from)", "TreeSet<E> subSet(E from, E to)"] });
def("TreeSet", "java.util", {
  p: ["E"], ext: ["SortedSet"],
  m: ["E floor(E e)", "E ceiling(E e)", "E lower(E e)", "E higher(E e)", "E pollFirst()", "E pollLast()",
      "TreeSet<E> descendingSet()", "Iterator<E> descendingIterator()"],
});
def("Entry", "java.util", { i: 1, p: ["K", "V"], m: ["K getKey()", "V getValue()", "V setValue(V value)"] });
def("Map", "java.util", {
  i: 1, p: ["K", "V"],
  s: ["Map of(Object... kv)", "Entry entry(Object k, Object v)", "Map copyOf(Map<?,?> m)", "Map ofEntries(Entry<?,?>... entries)"],
  m: ["V put(K key, V value)", "V get(Object key)", "V getOrDefault(Object key, V def)", "boolean containsKey(Object key)",
      "boolean containsValue(Object value)", "V remove(Object key)", "int size()", "boolean isEmpty()", "void clear()",
      "Set<K> keySet()", "Collection<V> values()", "Set<Entry<K,V>> entrySet()", "V putIfAbsent(K key, V value)",
      "V computeIfAbsent(K key, Function<K,V> f)", "V computeIfPresent(K key, BiFunction<K,V,V> f)", "V compute(K key, BiFunction<K,V,V> f)",
      "V merge(K key, V value, BiFunction<V,V,V> f)", "void putAll(Map<K,V> m)", "void forEach(BiConsumer<K,V> action)",
      "V replace(K key, V value)", "void replaceAll(BiFunction<K,V,V> f)"],
});
def("HashMap", "java.util", { p: ["K", "V"], ext: ["Map"] });
def("LinkedHashMap", "java.util", { p: ["K", "V"], ext: ["Map"] });
def("ConcurrentHashMap", "java.util.concurrent", { p: ["K", "V"], ext: ["Map"] });
def("SortedMap", "java.util", { i: 1, p: ["K", "V"], ext: ["Map"], m: ["K firstKey()", "K lastKey()", "TreeMap<K,V> headMap(K to)", "TreeMap<K,V> tailMap(K from)", "TreeMap<K,V> subMap(K from, K to)"] });
def("TreeMap", "java.util", {
  p: ["K", "V"], ext: ["SortedMap"],
  m: ["Entry<K,V> firstEntry()", "Entry<K,V> lastEntry()", "K floorKey(K k)", "K ceilingKey(K k)", "K lowerKey(K k)", "K higherKey(K k)",
      "Entry<K,V> floorEntry(K k)", "Entry<K,V> ceilingEntry(K k)", "Entry<K,V> lowerEntry(K k)", "Entry<K,V> higherEntry(K k)",
      "Entry<K,V> pollFirstEntry()", "Entry<K,V> pollLastEntry()", "TreeMap<K,V> descendingMap()", "Set<K> descendingKeySet()", "Set<K> navigableKeySet()"],
});
def("Comparator", "java.util", {
  i: 1, p: ["T"],
  s: ["Comparator comparing(Function<?,?> f)", "Comparator comparingInt(ToIntFunction<?> f)", "Comparator comparingLong(ToLongFunction<?> f)",
      "Comparator comparingDouble(ToDoubleFunction<?> f)", "Comparator naturalOrder()", "Comparator reverseOrder()",
      "Comparator nullsFirst(Comparator<?> c)", "Comparator nullsLast(Comparator<?> c)"],
  m: ["int compare(T a, T b)", "Comparator<T> reversed()", "Comparator<T> thenComparing(Comparator<T> c)", "Comparator<T> thenComparingInt(ToIntFunction<T> f)",
      "Comparator<T> thenComparingLong(ToLongFunction<T> f)", "Comparator<T> thenComparingDouble(ToDoubleFunction<T> f)"],
});
def("Arrays", "java.util", {
  s: ["String toString(Object a)", "String deepToString(Object[] a)", "void sort(Object a)", "void sort(Object a, int from, int to)",
      "void sort(Object[] a, Comparator<?> c)", "void parallelSort(Object a)", "void fill(Object a, Object val)", "void fill(Object a, int from, int to, Object val)",
      "Object copyOf(Object a, int newLength)", "Object copyOfRange(Object a, int from, int to)", "List asList(Object... a)",
      "boolean equals(Object a, Object b)", "boolean deepEquals(Object[] a, Object[] b)", "int hashCode(Object a)",
      "int binarySearch(Object a, Object key)", "int binarySearch(Object a, int from, int to, Object key)", "IntStream stream(int[] a)",
      "void setAll(Object a, Object generator)", "int mismatch(Object a, Object b)", "int compare(Object a, Object b)"],
});
def("Collections", "java.util", {
  s: ["void sort(List<?> list)", "void sort(List<?> list, Comparator<?> c)", "void reverse(List<?> list)", "void shuffle(List<?> list)",
      "void shuffle(List<?> list, Random rnd)", "void swap(List<?> list, int i, int j)", "Object max(Collection<?> c)", "Object min(Collection<?> c)",
      "int binarySearch(List<?> list, Object key)", "int frequency(Collection<?> c, Object o)", "void fill(List<?> list, Object o)",
      "Comparator reverseOrder()", "List nCopies(int n, Object o)", "boolean addAll(Collection<?> c, Object... elements)",
      "List unmodifiableList(List<?> l)", "Set unmodifiableSet(Set<?> s)", "Map unmodifiableMap(Map<?,?> m)",
      "List synchronizedList(List<?> l)", "List emptyList()", "Set emptySet()", "Map emptyMap()", "List singletonList(Object o)",
      "void rotate(List<?> list, int distance)", "boolean disjoint(Collection<?> a, Collection<?> b)"],
});

// ---- Functional / streams ----
def("Function", "java.util.function", { i: 1, p: ["T", "R"], s: ["Function identity()"], m: ["R apply(T t)", "Function andThen(Function<?,?> f)", "Function compose(Function<?,?> f)"] });
def("BiFunction", "java.util.function", { i: 1, p: ["T", "U", "R"], m: ["R apply(T t, U u)"] });
def("UnaryOperator", "java.util.function", { i: 1, p: ["T"], m: ["T apply(T t)"] });
def("BinaryOperator", "java.util.function", { i: 1, p: ["T"], m: ["T apply(T a, T b)"] });
def("Supplier", "java.util.function", { i: 1, p: ["T"], m: ["T get()"] });
def("Consumer", "java.util.function", { i: 1, p: ["T"], m: ["void accept(T t)", "Consumer<T> andThen(Consumer<T> c)"] });
def("BiConsumer", "java.util.function", { i: 1, p: ["T", "U"], m: ["void accept(T t, U u)"] });
def("Predicate", "java.util.function", { i: 1, p: ["T"], m: ["boolean test(T t)", "Predicate<T> and(Predicate<T> o)", "Predicate<T> or(Predicate<T> o)", "Predicate<T> negate()"] });
def("IntPredicate", "java.util.function", { i: 1, m: ["boolean test(int v)"] });
def("IntFunction", "java.util.function", { i: 1, p: ["R"], m: ["R apply(int v)"] });
def("IntUnaryOperator", "java.util.function", { i: 1, m: ["int applyAsInt(int v)"] });
def("IntBinaryOperator", "java.util.function", { i: 1, m: ["int applyAsInt(int a, int b)"] });
def("ToIntFunction", "java.util.function", { i: 1, p: ["T"], m: ["int applyAsInt(T t)"] });
def("Callable", "java.util.concurrent", { i: 1, p: ["V"], m: ["V call()"] });
def("Stream", "java.util.stream", {
  i: 1, p: ["T"],
  s: ["Stream of(Object... values)", "Stream empty()", "Stream iterate(Object seed, UnaryOperator<?> f)", "Stream generate(Supplier<?> s)"],
  m: ["Stream<T> filter(Predicate<T> p)", "Stream<R> map(Function<T,R> f)", "IntStream mapToInt(ToIntFunction<T> f)", "Stream<R> flatMap(Function<T,Stream<R>> f)",
      "Stream<T> sorted()", "Stream<T> sorted(Comparator<T> c)", "Stream<T> distinct()", "Stream<T> limit(long n)", "Stream<T> skip(long n)",
      "Stream<T> peek(Consumer<T> c)", "void forEach(Consumer<T> action)", "Object collect(Collector<?,?,?> c)", "List<T> toList()", "long count()",
      "Optional<T> findFirst()", "Optional<T> findAny()", "boolean anyMatch(Predicate<T> p)", "boolean allMatch(Predicate<T> p)",
      "boolean noneMatch(Predicate<T> p)", "Optional<T> min(Comparator<T> c)", "Optional<T> max(Comparator<T> c)", "Object[] toArray()",
      "T reduce(T identity, BinaryOperator<T> op)"],
});
def("IntStream", "java.util.stream", {
  i: 1,
  s: ["IntStream range(int start, int end)", "IntStream rangeClosed(int start, int end)", "IntStream of(int... values)", "IntStream iterate(int seed, IntUnaryOperator f)"],
  m: ["IntStream filter(IntPredicate p)", "IntStream map(IntUnaryOperator f)", "Stream<R> mapToObj(IntFunction<R> f)", "Stream<Integer> boxed()",
      "int sum()", "OptionalInt max()", "OptionalInt min()", "OptionalDouble average()", "long count()", "int[] toArray()", "void forEach(Consumer<Integer> action)",
      "boolean anyMatch(IntPredicate p)", "boolean allMatch(IntPredicate p)", "boolean noneMatch(IntPredicate p)", "IntStream sorted()", "IntStream distinct()",
      "IntStream limit(long n)", "IntStream skip(long n)", "int reduce(int identity, IntBinaryOperator op)"],
});
def("Collector", "java.util.stream", { i: 1, p: ["T", "A", "R"] });
def("Collectors", "java.util.stream", {
  s: ["Collector toList()", "Collector toSet()", "Collector toMap(Function<?,?> k, Function<?,?> v)", "Collector joining()",
      "Collector joining(CharSequence delimiter)", "Collector groupingBy(Function<?,?> f)", "Collector counting()", "Collector summingInt(ToIntFunction<?> f)",
      "Collector averagingInt(ToIntFunction<?> f)", "Collector partitioningBy(Predicate<?> p)", "Collector mapping(Function<?,?> f, Collector<?,?,?> c)"],
});

// ---- java.math ----
def("RoundingMode", "java.math", { s: ["RoundingMode HALF_UP", "RoundingMode HALF_DOWN", "RoundingMode HALF_EVEN", "RoundingMode UP", "RoundingMode DOWN", "RoundingMode CEILING", "RoundingMode FLOOR"] });
def("BigInteger", "java.math", {
  ext: ["Number"],
  s: ["BigInteger ZERO", "BigInteger ONE", "BigInteger TWO", "BigInteger TEN", "BigInteger valueOf(long val)"],
  m: ["BigInteger add(BigInteger o)", "BigInteger subtract(BigInteger o)", "BigInteger multiply(BigInteger o)", "BigInteger divide(BigInteger o)",
      "BigInteger mod(BigInteger m)", "BigInteger remainder(BigInteger o)", "BigInteger pow(int e)", "BigInteger gcd(BigInteger o)",
      "BigInteger modPow(BigInteger e, BigInteger m)", "BigInteger modInverse(BigInteger m)", "BigInteger negate()", "BigInteger abs()",
      "BigInteger sqrt()", "BigInteger max(BigInteger o)", "BigInteger min(BigInteger o)", "BigInteger shiftLeft(int n)", "BigInteger shiftRight(int n)",
      "BigInteger and(BigInteger o)", "BigInteger or(BigInteger o)", "BigInteger xor(BigInteger o)", "BigInteger not()", "boolean testBit(int n)",
      "int bitCount()", "int bitLength()", "int signum()", "boolean isProbablePrime(int certainty)", "BigInteger nextProbablePrime()",
      "BigInteger[] divideAndRemainder(BigInteger o)", "int compareTo(BigInteger o)", "String toString(int radix)"],
});
def("BigDecimal", "java.math", {
  ext: ["Number"],
  s: ["BigDecimal ZERO", "BigDecimal ONE", "BigDecimal TEN", "BigDecimal valueOf(double val)"],
  m: ["BigDecimal add(BigDecimal o)", "BigDecimal subtract(BigDecimal o)", "BigDecimal multiply(BigDecimal o)", "BigDecimal divide(BigDecimal o)",
      "BigDecimal divide(BigDecimal o, int scale, RoundingMode mode)", "BigDecimal remainder(BigDecimal o)", "BigDecimal pow(int n)",
      "BigDecimal setScale(int scale, RoundingMode mode)", "BigDecimal negate()", "BigDecimal abs()", "BigDecimal stripTrailingZeros()",
      "int scale()", "int signum()", "int compareTo(BigDecimal o)", "String toPlainString()"],
});

/* ---- compile members ---- */
const MEMBER_RE = /^(.+?)\s+(\w+)(?:\((.*)\))?$/;
const splitTop = (s) => {
  const out = []; let d = 0, cur = "";
  for (const c of s) {
    if (c === "<" || c === "(") d++; else if (c === ">" || c === ")") d--;
    if (c === "," && d === 0) { out.push(cur.trim()); cur = ""; } else cur += c;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
};
const parseMember = (str, isStatic) => {
  const m = MEMBER_RE.exec(str);
  return { static: isStatic, ret: m[1], name: m[2], isMethod: m[3] !== undefined, sig: m[3] ?? "", params: m[3] ? splitTop(m[3]) : [] };
};
for (const c of Object.values(J)) {
  c.all = [
    ...c.s.map((x) => ({ mem: parseMember(x, true), owner: c })),
    ...c.m.map((x) => ({ mem: parseMember(x, false), owner: c })),
  ];
}
function collect(name) {
  const out = [], keys = new Set(), seen = new Set();
  const walk = (n) => {
    const c = J[n]; if (!c || seen.has(n)) return; seen.add(n);
    for (const e of c.all) {
      const k = e.mem.static + e.mem.name + e.mem.sig;
      if (!keys.has(k)) { keys.add(k); out.push(e); }
    }
    c.ext.forEach(walk);
  };
  walk(name); walk("Object");
  return out;
}

/* ============================================================
   2. TYPE INFERENCE
   ============================================================ */
const OBJ = { name: "Object", args: [], dims: 0 };
const INT = { name: "int", args: [], dims: 0 };

function parseType(s) {
  s = s.trim(); let dims = 0;
  while (s.endsWith("[]")) { dims++; s = s.slice(0, -2).trim(); }
  const m = /^([\w.]+)(?:<(.*)>)?$/.exec(s);
  if (!m) return null;
  return { name: m[1].split(".").pop(), args: m[2] ? splitTop(m[2]).map((a) => parseType(a) || OBJ) : [], dims };
}
function subst(t, ctx) {
  if (t.name === "this") return ctx;
  const idx = J[ctx.name] ? J[ctx.name].p.indexOf(t.name) : -1;
  if (idx >= 0 && !t.dims) return ctx.args[idx] || OBJ;
  if (!J[t.name] && /^[A-Z]$/.test(t.name)) return OBJ;
  return { ...t, args: t.args.map((a) => subst(a, ctx)) };
}
const resolveRet = (ret, ctx) => { const t = parseType(ret); return t ? subst(t, ctx) : null; };

// Declared variables: "Type name" followed by = ; , : ) [
const VAR_RE = /\b((?:int|long|double|boolean|char|byte|short|float)|[A-Z]\w*(?:<[^;(){}=]*?>)?)((?:\[\])*)\s+(\w+)\s*(?=[=;,:)\[])/g;
function scanVars(text, offset) {
  const before = new Map(), after = new Map();
  for (const m of text.matchAll(VAR_RE)) {
    const t = parseType(m[1] + m[2]); if (!t) continue;
    if (m.index < offset) before.set(m[3], t); else if (!after.has(m[3])) after.set(m[3], t);
  }
  for (const [k, v] of after) if (!before.has(k)) before.set(k, v);
  for (const m of text.matchAll(/\bvar\s+(\w+)\s*=\s*new\s+(\w+)/g)) before.set(m[1], parseType(m[2]));
  return before;
}

function extractExpr(s) {
  let i = s.length, depth = 0;
  while (i > 0) {
    const c = s[i - 1];
    if (c === ")" || c === "]") depth++;
    else if (c === "(" || c === "[") { if (depth === 0) break; depth--; }
    else if (depth === 0 && !/[\w.$]/.test(c)) break;
    i--;
  }
  let expr = s.slice(i).replace(/^\.+/, "");
  if (/\bnew\s+$/.test(s.slice(0, i))) expr = "new " + expr;
  return expr;
}
function splitSegments(expr) {
  const segs = []; let d = 0, cur = "";
  for (const c of expr) {
    if (c === "(" || c === "[") d++; else if (c === ")" || c === "]") d--;
    if (c === "." && d === 0) { segs.push(cur); cur = ""; } else cur += c;
  }
  segs.push(cur);
  return segs.map((t) => {
    const m = /^(new\s+)?(\w+)(?:<.*?>)?(\(.*\))?((?:\[.*\])*)$/s.exec(t.trim());
    if (!m) return null;
    let idx = 0, d2 = 0;
    for (const c of m[4] || "") { if (c === "[") { if (d2 === 0) idx++; d2++; } else if (c === "]") d2--; }
    return { isNew: !!m[1], name: m[2], call: !!m[3], idx };
  });
}
function resolveChain(expr, vars) {
  const segs = splitSegments(expr);
  let cur = null, isStatic = false;
  for (let i = 0; i < segs.length; i++) {
    const sg = segs[i]; if (!sg) return null;
    if (i === 0) {
      if (sg.isNew) cur = { name: sg.name, args: [], dims: 0 };
      else if (sg.call || sg.name === "this") return null;
      else if (vars.has(sg.name)) cur = vars.get(sg.name);
      else if (J[sg.name]) { cur = { name: sg.name, args: [], dims: 0 }; isStatic = true; }
      else if (sg.name === "in") cur = { name: "InputReader", args: [], dims: 0 };
      else if (sg.name === "out") cur = { name: "PrintWriter", args: [], dims: 0 };
      else return null;
    } else if (cur.dims > 0) {
      if (sg.name === "length") cur = INT; else if (sg.name === "clone") cur = cur; else return null;
    } else {
      const hit = collect(cur.name).find((e) => e.mem.name === sg.name && e.mem.static === isStatic);
      if (!hit) return null;
      cur = resolveRet(hit.mem.ret, cur); if (!cur) return null;
      isStatic = false;
    }
    for (let k = 0; k < sg.idx; k++) { if (cur.dims > 0) cur = { ...cur, dims: cur.dims - 1 }; else return null; }
  }
  return { type: cur, isStatic };
}

/* ============================================================
   3. COMPLETION ITEMS
   ============================================================ */
function memberItem(mem, owner, range, tier) {
  const pnames = mem.params.map((p) => p.split(/\s+/).pop());
  const sig = mem.isMethod ? `(${mem.sig})` : "";
  return {
    label: { label: mem.name, detail: sig, description: mem.ret === "this" ? owner.name : mem.ret },
    kind: mem.isMethod ? K.Method : /^[A-Z0-9_]+$/.test(mem.name) ? K.Constant : K.Field,
    detail: `${mem.ret} ${owner.name}.${mem.name}${sig}`,
    documentation: { value: "`" + owner.pkg + "." + owner.name + "`" },
    filterText: mem.name,
    sortText: (tier ?? (USED_MEMBERS.has(mem.name) ? "0" : "1")) + mem.name,
    insertText: mem.isMethod
      ? pnames.length ? `${mem.name}(${pnames.map((p, i) => `\${${i + 1}:${p}}`).join(", ")})` : `${mem.name}()`
      : mem.name,
    insertTextRules: SNIP,
    range,
  };
}
function memberItems({ type, isStatic }, range) {
  if (type.dims > 0) {
    return [
      { label: "length", kind: K.Field, detail: "int (array length)", insertText: "length", sortText: "0length", range },
      { label: "clone", kind: K.Method, detail: "Object clone()", insertText: "clone()", sortText: "1clone", range },
    ];
  }
  return collect(type.name).filter((e) => e.mem.static === isStatic).map((e) => memberItem(e.mem, e.owner, range));
}

// Used when the receiver's type can't be worked out: every known member name, low priority
const FALLBACK = (() => {
  const seen = new Map();
  for (const c of Object.values(J)) for (const e of c.all) if (!seen.has(e.mem.name)) seen.set(e.mem.name, e);
  return [...seen.values()].map((e) => memberItem(e.mem, e.owner, null, "9"));
})();

const KEYWORDS = ["int", "long", "double", "boolean", "char", "byte", "short", "float", "void", "var", "new", "return", "if", "else",
  "for", "while", "do", "switch", "case", "default", "break", "continue", "class", "interface", "enum", "static", "final", "private",
  "public", "protected", "abstract", "try", "catch", "finally", "throw", "throws", "extends", "implements", "import", "package",
  "this", "super", "null", "true", "false", "instanceof"];

function classItems(text, range) {
  const words = new Set(text.match(/\b[A-Za-z_]\w*\b/g));
  const items = Object.values(J).map((c) => ({
    label: c.name, kind: c.i ? K.Interface : K.Class, detail: c.pkg,
    sortText: (USED_CLASSES.has(c.name) || words.has(c.name) ? "0" : "1") + c.name,
    insertText: c.name, range,
  }));
  items.push(
    { label: "in", kind: K.Variable, detail: "InputReader (custom)", sortText: "0in", insertText: "in", range },
    { label: "out", kind: K.Variable, detail: "PrintWriter", sortText: "0out", insertText: "out", range },
  );
  for (const k of KEYWORDS) items.push({ label: k, kind: K.Keyword, sortText: "2" + k, insertText: k, range });
  return items;
}

/* ============================================================
   4. PROVIDER
   ============================================================ */
monaco.languages.registerCompletionItemProvider("java", {
  triggerCharacters: ["."],
  provideCompletionItems(model, position) {
    const w = model.getWordUntilPosition(position);
    const range = {
      startLineNumber: position.lineNumber, endLineNumber: position.lineNumber,
      startColumn: w.startColumn, endColumn: w.endColumn,
    };
    const before = model.getLineContent(position.lineNumber).slice(0, w.startColumn - 1);

    // import java.util.|  -> classes of that package
    const imp = /^\s*import\s+(?:static\s+)?([\w.]+)\.$/.exec(before);
    if (imp) {
      const items = Object.values(J).filter((c) => c.pkg === imp[1])
        .map((c) => ({ label: c.name, kind: c.i ? K.Interface : K.Class, detail: c.pkg, insertText: c.name, range }));
      items.push({ label: "*", kind: K.Keyword, insertText: "*", range });
      return { suggestions: items };
    }

    if (before.endsWith(".")) {
      const expr = extractExpr(before.slice(0, -1));
      if (!expr || /^\d/.test(expr)) return { suggestions: [] };
      const res = resolveChain(expr, scanVars(model.getValue(), model.getOffsetAt(position)));
      if (!res) return { suggestions: FALLBACK.map((f) => ({ ...f, range })) };
      return { suggestions: memberItems(res, range) };
    }
    return { suggestions: classItems(model.getValue(), range) };
  },
});




}